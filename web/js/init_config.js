INIT_CONFIG = {
    dns: {
        fields: {
            hostname: 'hostname',
            parent_domain: 'fqdn'
        },
        sub_tabs: [ 'dyndns', 'djbdns' ],
        dyndns: {
            exclusive: 'provider',
            fields: {
                account: 'text',
                user: 'text',
                password: 'password',
                zone: 'fqdn'
            }
        },
        djbdns: {
            exclusive: 'provider',
            fields: {
                allow_axfr: 'list/ipaddr'
            }
        }
    },

    ssl: {
        fields: {
            cert_key_file: 'file/certs/ssl-https.key',
            cert_pem_file: 'file/certs/ssl-https.pem'
        }
    },

    smtp: {
        fields: {
            username: 'text',
            password: 'password',
            host: 'fqdn',
            port: 'port'
        }
    },

    two_factor: {
        fields: {
            user: 'text',
            base_uri: 'pick_one'
        },
        choices: {
            base_uri: ['https://api.authy.com', 'http://sandbox-api.authy.com']
        }
    },

    storage: {
        fields: {
            aws_access_key: 'text',
            aws_secret_key: 'text',
            s3_bucket: 'text',
            aws_iam_user: 'text',
            backup_cron_schedule: 'time_of_day'
        }
    },

    geoip: {
        fields: {
            GeoIP: 'file/data_files/geoip/GeoIP.dat.gz',
            GeoLiteCity: 'file/data_files/geoip/GeoLiteCity.dat.gz',
            GeoIP2_City: 'file/data_files/geoip/GeoIP2-City.mmdb.gz',
            GeoLite2_City: 'file/data_files/geoip/GeoLite2-City.mmdb.gz',
            GeoLite2_Country: 'file/data_files/geoip/GeoLite2-Country.mmdb.gz'
        }
    },

    claim: {
        fields: {
            recovery_email: 'email',
            admin_initial_pass: 'password'
        }
    }
};