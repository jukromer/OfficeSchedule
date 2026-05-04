import os


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret')

    LDAP_SERVER = os.getenv('LDAP_SERVER', 'ldap://localhost')
    LDAP_BASE_DN = os.getenv('LDAP_BASE_DN', 'dc=example,dc=local')
    LDAP_USER_DN_TEMPLATE = os.getenv('LDAP_USER_DN_TEMPLATE') or None
    LDAP_BIND_DN = os.getenv('LDAP_BIND_DN')
    LDAP_BIND_PASSWORD = os.getenv('LDAP_BIND_PASSWORD')
    LDAP_USER_SUBTREE = os.getenv('LDAP_USER_SUBTREE')
    LDAP_USER_FILTER = os.getenv('LDAP_USER_FILTER', '(objectClass=person)')
    LDAP_AUTHORIZED_GROUP_DN = os.getenv('LDAP_AUTHORIZED_GROUP_DN')
    LDAP_AUTHORIZED_GROUP_MEMBER_ATTR = os.getenv('LDAP_AUTHORIZED_GROUP_MEMBER_ATTR', 'memberUid')

    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
