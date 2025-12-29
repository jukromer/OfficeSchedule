from ldap3 import Server, Connection, ALL
from ldap3.core.exceptions import LDAPBindError, LDAPException
from flask import current_app


def _resolve_user_dn(conn, base_dn, username):
    """Look up the distinguished name for a given username."""
    search_filter = f"(|(sAMAccountName={username})(uid={username})(cn={username}))"
    if not conn.search(base_dn, search_filter, attributes=['distinguishedName']):
        return None

    if not conn.entries:
        return None

    entry = conn.entries[0]
    return entry.distinguishedName.value


def authenticate(username, password):
    """Authenticate an LDAP user using either a DN template or a search bind."""
    config = current_app.config
    server = Server(config['LDAP_SERVER'], get_info=ALL)
    user_dn_template = config.get('LDAP_USER_DN_TEMPLATE')
    bind_dn = config.get('LDAP_BIND_DN')
    bind_password = config.get('LDAP_BIND_PASSWORD')
    base_dn = config.get('LDAP_BASE_DN')

    user_dn = user_dn_template.format(username=username) if user_dn_template else None

    try:
        if not user_dn:
            if not (bind_dn and bind_password and base_dn):
                current_app.logger.error('LDAP bind credentials/base DN must be configured.')
                return False

            # Use the service account to resolve the user's DN.
            with Connection(server, user=bind_dn, password=bind_password, auto_bind=True) as conn:
                user_dn = _resolve_user_dn(conn, base_dn, username)

            if not user_dn:
                current_app.logger.info('LDAP user "%s" was not found.', username)
                return False

        with Connection(server, user=user_dn, password=password, auto_bind=True) as user_conn:
            return user_conn.bound
    except LDAPBindError:
        current_app.logger.warning('Invalid LDAP credentials for "%s".', username)
        return False
    except LDAPException as exc:
        current_app.logger.error('Unexpected LDAP error: %s', exc)
        return False
