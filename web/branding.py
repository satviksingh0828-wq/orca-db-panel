##########################################################################
#
# pgAdmin 4 - PostgreSQL Tools
#
# Copyright (C) 2013 - 2026, The pgAdmin Development Team
# This software is released under the PostgreSQL Licence
#
##########################################################################

##########################################################################
# Application branding
##########################################################################

# Name of the application to display in the UI
APP_NAME = 'ORCA DB PANEL'
APP_ICON = 'pg-icon'  # Retained for compatibility with the upstream icon CSS.

# To help define the configuration directory and data directory
APP_SHORT_NAME = 'pgadmin4'  # Internal compatibility identifier; visible branding is ORCA DB PANEL.
APP_PATH = 'pgadmin'  # Keep the upstream container data path /var/lib/pgadmin compatible.
APP_WIN_PATH = "pgAdmin"  # Keep existing desktop data locations compatible.

# Copyright string for display in the app
APP_COPYRIGHT = 'ORCA DB PANEL'

# User ID (email address) to use for the default user in desktop mode.
# The default should be fine here, as it's not exposed in the app.
APP_DEFAULT_EMAIL = 'orca-db-panel@localhost'
