try:
    import pymysql
    # Habilitar PyMySQL como driver compatible de MySQLdb para Django y MariaDB
    pymysql.install_as_MySQLdb()
except ImportError:
    pass
