
TRANSLATIONS['en'] = {
    dns: {
        tab: 'DNS',
        title: 'Configure DNS Services',
        description: 'This is the name that your cloudstead will have on the public Internet. ' +
        'Additionally, many apps for your cloudstead will require their own hostname. ' +
        'Configuring DNS services here will allow your cloudstead to create DNS records for these ' +
        'new hostnames when you install the apps.',

        parent_domain: {
            label: 'Parent Domain',
            help: 'The parent domain of your cloudstead. For example, if your cloudstead\'s fully qualified domain name is ' +
            'something.example.com, then the Parent Domain is "example.com" and the Hostname is "something"'
        },
        hostname: {
            label: 'Hostname',
            help: 'The name of your cloudstead. For example, if your cloudstead\'s fully qualified domain name is ' +
            'something.example.com, then the Parent Domain is "example.com" and the Hostname is "something"'
        },
        sub_tabs: {
            provider: {
                label: 'Provider',
                help: 'If you want your cloudstead to manage its own DNS service, choose djbdns.'
            }
        },

        dyndns: {
            description: 'Configure your cloudstead to use an account with <a href="http://dyn.com/">Dyn</a> for DNS services.',
            account: {
                label: 'Dyn Customer Name',
                help: 'This is what you enter into the "Customer Name" field when logging in to Dyn'
            },
            user: {
                label: 'Dyn Username',
                help: 'This is what you enter into the "Username" field when logging in to Dyn'
            },
            password: {
                label: 'Dyn Password',
                help: 'This is the password for the Dyn Username'
            },
            zone: {
                label: 'Dyn DNS Zone',
                help: 'The fully-qualified zone name.'
            }
        },

        djbdns: {
            description: 'Configure your cloudstead to use <a href="http://cr.yp.to/djbdns.html">djbdns</a> (also called tinydns) ' +
            'for DNS services. The djbdns server will be installed automatically with your new cloudstead, but you will need ' +
            'to update your Name Servers with your domain registrars to include the hostname of this new cloudstead. ' +
            'You will also need to ensure that this is the primary DNS server for your domain, and all other Name Servers will ' +
            'be secondaries.',
            allow_axfr: {
                label: 'Secondary Name Servers',
                help: 'Enter a list of IP addresses separated by spaces and/or commas. Zone transfers will be allowed from these IP addresses.'
            }
        }
    },

    ssl: {
        tab: 'SSL',
        title: 'Set up SSL certificate',
        description: 'Your cloudstead needs a wildcard SSL certificate to enable HTTPS. ' +
        'It must be a wildcard certificate because many apps require their own hostname. ' +
        'Your cloudstead will create the hostnames in DNS, but in order for them to work with HTTPS, they must ' +
        'use this wildcard certificate. In the future, we may support per-application SSL certificates.',
        cert_key_file: {
            label: 'SSL Certificate Key',
            help: 'This is the private key portion of your SSL certificate. It must be a wildcard certificate.'
        },
        cert_pem_file: {
            label: 'SSL Certificate PEM',
            help: 'This is the public key portion of your SSL certificate. It must be a wildcard certificate.'
        }
    },

    smtp: {
        tab: 'SMTP',
        title: 'Setup SMTP services for sending email',
        description: 'Your cloudstead cannot deliver email by itself. The Internet is so overrun with spam these days ' +
        'that any time a brand new server pops up on the Internet and tries to send email, most other email servers ' +
        'in the world will not trust it. They will either totally ignore it, or will pretend to respond but actually not ' +
        'relay or deliver any email. So it\'s important to have an SMTP relay set up that your cloudstead will route its ' +
        'mail through. If you run your own SMTP relay, you can enter those credentials here. If you do not have an SMTP ' +
        'relay, signing up with <a href="https://sendgrid.com">Sendgrid</a> (send up to 400/day or 12,000/month for free) ' +
        'or <a href="http://www.mailgun.com/">Mailgun</a> (send up to 10,000/month for free)',

        host: {
            label: 'SMTP host',
            help: 'This is the hostname of the SMTP relay'
        },
        port: {
            label: 'SMTP port',
            help: 'The port number to connect to on the SMTP host'
        },
        username: {
            label: 'SMTP username',
            help: 'Your cloudstead will use this username when authenticating with the SMTP host'
        },
        password: {
            label: 'SMTP password',
            help: 'Your cloudstead will use this password when authenticating with the SMTP host'
        }
    },

    two_factor: {
        tab: 'Two-Factor Auth',
        title: 'Configure two-factor authentication for logins to your cloudstead',
        description: 'Your cloudstead supports two-factor authentication via integration ' +
        'with <a href="https://www.authy.com/">Authy</a>. If you have an Authy account, enter your API ' +
        'key here.',

        user: {
            label: 'API Key',
            help: 'This is your API key with Authy. You can find it in your Authy control panel.'
        },
        base_uri: {
            label: 'Authy API',
            help: 'Choose the sandbox server for testing purposes, or the production server if you\'re ready for prime time.',
            options: {
                'https://api.authy.com': 'Authy Production API: https://api.authy.com',
                'http://sandbox-api.authy.com': 'Authy Sandbox API: http://sandbox-api.authy.com'
            }
        }
    },

    storage: {
        tab: 'Storage',
        title: 'Configure external cloud storage',
        description: 'You can enjoy unlimited data storage by leveraging a cloud storage provider. ' +
        'Cloud storage is used by certain apps (like the built-in owncloud server), and during backup/restore operations' +
        'Your cloudstead will always encrypt data locally before writing to the cloud storage. ' +
        'Currently only Amazon S3 is supported but we have plans to support many more cloud storage providers.',

        aws_access_key: {
            label: 'AWS Access Key',
            help: 'Your AWS Access Key. Please use a new key created specifically for this cloudstead. It should only have read/write permissions on the subdirectory of the S3 bucket configured here'
        },
        aws_secret_key: {
            label: 'AWS Secret Key',
            help: 'Your AWS Secret Key. Please use a new key created specifically for this cloudstead. It should only have read/write permissions on the subdirectory of the S3 bucket configured here'
        },
        s3_bucket: {
            label: 'S3 Bucket',
            help: 'Everything your cloudstead writes to S3 will be stored in this bucket'
        },
        aws_iam_user: {
            label: 'S3 Bucket Prefix',
            help: 'Everything your cloudstead writes to S3 will be stored underneath this prefix within the S3 bucket'
        },
        backup_cron_schedule: {
            label: 'Nightly Backup Time',
            help: 'When to backup your cloudstead. Enter a clock time using the 24-hour format; for example 23:15 means backup every night at 11:15 PM'
        }
    },

    geoip: {
        tab: 'GeoIP',
        title: 'Configure GeoIP Databases',
        description: 'GeoIP databases provide a means for determining, based on another computer\'s Internet address, ' +
        'where in the world it is. Apps on your cloudstead can take advantage of GeoIP services to offer enhanced features. ' +
        'Cloudstead supports GeoIP databases from MaxMind, a leading GeoIP provider. Support for additonal providers ' +
        'is on the roadmap.',

        GeoIP: {
            label: 'GeoIP Legacy Database',
            help: 'GeoIP Database, legacy format, license required. <a href="http://dev.maxmind.com/geoip/legacy/downloadable/">Purchase from Maxmind</a>.'
        },
        GeoLiteCity: {
            label: 'GeoIP Lite City Database',
            help: 'City Database, legacy format, free. <a href="http://dev.maxmind.com/geoip/legacy/geolite/">Download from from Maxmind</a>.'
        },
        GeoIP2_City: {
            label: 'GeoIP2 City Database',
            help: 'City Database, more accurate, license required. <a href="https://www.maxmind.com/en/geoip2-city">Purchase from Maxmind</a>.'
        },
        GeoLite2_City: {
            label: 'GeoIP2 Lite City Database',
            help: 'City Database, free. <a href="http://dev.maxmind.com/geoip/geoip2/geolite2/">Download from Maxmind</a>.'
        },
        GeoLite2_Country: {
            label: 'GeoIP2 Lite Country Database',
            help: 'Country Database, free. <a href="http://dev.maxmind.com/geoip/geoip2/geolite2/">Download from Maxmind</a>.'
        }
    },

    claim: {
        tab: 'Claiming',
        title: 'How to Claim Your Cloudstead',
        description: 'It takes two pieces of information to claim a cloudstead. First, you need to know the ' +
        'password, which is set here. Secondly, when the cloudstead has completed setting itself up, it ' +
        'will send an email to the address set here. That message will include the URL to claim the cloudstead ' +
        'along with a key that it generated itself. This is the only place that you can set both the password and ' +
        'the email address. Once your cloudstead is running, the primary admin user will be responsible for deciding ' +
        'who has access and how much they should have. Initially this primary admin is probably you, but ' +
        'you\'re always free to delegate :)',
        admin_initial_pass: {
            label: 'password',
            help: 'This is the password that you\'ll use to claim the cloudstead. It will be strongly encrypted (12-round bcrypt) ' +
            'when it is written to the configuration files. It will never be stored in plaintext ' +
            'except in this computer\'s RAM from now until you close this browser session.'
        },
        recovery_email: {
            label: 'email',
            help: 'When your cloudstead has successfully completed setting itself up, it will send ' +
            'an email to this address with the '
        }
    },

    apps: {
        tab: 'Apps',
        title: 'Pre-Install Apps',
        description: 'Select the apps you would like to come pre-installed on your cloudstead'
    },

    launch: {
        tab: 'Launch',
        title: 'Launch Your Cloudstead!',
        description: 'Click the "Generate Configuration" button to save the configuration you\'ve created here.' +
        'This will generate a zipfile, please save it within the "launcher" directory. ' +
        'Then, get a target system ready. The target system must be running Ubuntu 14.x, and a you ' +
        'must have access to a user account that can (a) login via SSH using a keyfile and ' +
        '(b) has passwordless-sudo privileges. More on how to set up such a system here: Link TBD. ' +
        'Once this is setup, open a terminal window and run the following command:<br/><br/>' +
        'cd /path/handy-toolbox/launcher ; ./deploy.sh user@host<br/><br/>' +
        'This will start the launch process.'
    }

};