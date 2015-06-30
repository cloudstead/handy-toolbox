INIT_CONFIG = {
    dns: {
        fields: [ 'hostname', 'parent_domain' ],
        sub_tabs: [ 'dyndns', 'djbdns' ],
        dyndns: {
            exclusive: 'provider',
            fields: [ 'dns.account', 'dns.user', 'dns.password', 'dns.zone' ]
        },
        djbdns: {
            exclusive: 'provider',
            fields: [ 'djbdbs/init/allow_axfr' ]
        }
    },

    ssl: {
        files: {
            cert_key: 'certs/ssl-https.key',
            cert_pem: 'certs/ssl-https.pem'
        }
    },

    smtp: {
        field_prefix: 'email/init',
        fields: [ 'username', 'password', 'host', 'port' ]
    },

    two_factor: {
        fields: ['authy.user', 'authy.base_uri']
    },

    storage: {
        fields: ['aws_access_key', 'aws_secret_key', 's3_bucket', 'aws_iam_user', 'backup_cron_schedule']
    },

    geoip: {
        files: {
            GeoIP: 'file/data_files/geoip/GeoIP.dat.gz',
            GeoLiteCity: 'file/data_files/geoip/GeoLiteCity.dat.gz',
            GeoIP2_City: 'file/data_files/geoip/GeoIP2-City.mmdb.gz',
            GeoLite2_City: 'file/data_files/geoip/GeoLite2-City.mmdb.gz',
            GeoLite2_Country: 'file/data_files/geoip/GeoLite2-Country.mmdb.gz'
        }
    },

    claim: {
        fields: ['recovery_email', 'admin_initial_pass']
    }
};