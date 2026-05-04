from ldap3 import Server, Connection, ALL, BASE
from ldap3.core.exceptions import LDAPBindError, LDAPException
from flask import current_app


def _resolve_user_dn(conn, search_base, user_filter, username):
    """Search for the user under search_base and return their entry DN."""
    combined_filter = f"(&{user_filter}(uid={username}))"
    if not conn.search(search_base, combined_filter, attributes=['uid']):
        return None
    if not conn.entries:
        return None
    return conn.entries[0].entry_dn


def _is_in_authorized_group(conn, group_dn, member_attr, username):
    """Return True when the group entry lists the username via member_attr."""
    group_filter = f"({member_attr}={username})"
    if not conn.search(group_dn, group_filter, search_scope=BASE, attributes=[member_attr]):
        return False
    return bool(conn.entries)


def authenticate(username, password):
    """Authenticate an LDAP user and optionally enforce group membership."""
    config = current_app.config
    server = Server(config['LDAP_SERVER'], get_info=ALL)
    user_dn_template = config.get('LDAP_USER_DN_TEMPLATE')
    bind_dn = config.get('LDAP_BIND_DN')
    bind_password = config.get('LDAP_BIND_PASSWORD')
    base_dn = config.get('LDAP_BASE_DN')
    user_subtree = config.get('LDAP_USER_SUBTREE')
    user_filter = config.get('LDAP_USER_FILTER') or '(objectClass=person)'
    group_dn = config.get('LDAP_AUTHORIZED_GROUP_DN')
    group_member_attr = config.get('LDAP_AUTHORIZED_GROUP_MEMBER_ATTR') or 'memberUid'

    search_base = f"{user_subtree},{base_dn}" if user_subtree else base_dn

    try:
        if user_dn_template:
            user_dn = user_dn_template.format(username=username)
        else:
            if not (bind_dn and bind_password and base_dn):
                current_app.logger.error('LDAP bind credentials/base DN must be configured.')
                return False

            with Connection(server, user=bind_dn, password=bind_password, auto_bind=True) as conn:
                user_dn = _resolve_user_dn(conn, search_base, user_filter, username)
                if not user_dn:
                    current_app.logger.info('LDAP user "%s" was not found.', username)
                    return False

                if group_dn and not _is_in_authorized_group(conn, group_dn, group_member_attr, username):
                    current_app.logger.info('LDAP user "%s" is not in the authorized group.', username)
                    return False

        with Connection(server, user=user_dn, password=password, auto_bind=True) as user_conn:
            return user_conn.bound
    except LDAPBindError:
        current_app.logger.warning('Invalid LDAP credentials for "%s".', username)
        return False
    except LDAPException as exc:
        current_app.logger.error('Unexpected LDAP error: %s', exc)
        return False
