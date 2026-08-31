/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2026, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import { styled } from '@mui/material/styles';
import gettext from 'sources/gettext';
import _ from 'lodash';
import PropTypes from 'prop-types';
import pgAdmin from 'sources/pgadmin';
import OrcaDbPanelLogo from './PgAdminLogo';
import { Link } from '@mui/material';


const Root = styled('div')(() => ({
  background: '#ffffff',
  color: '#000000',
  overflow: 'hidden',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  height: '100%',
  '& .WelcomeDashboard-dashboardContainer': {
    paddingBottom: '8px',
    minHeight: '100%',

    '& .WelcomeDashboard-row': {
      marginRight: '-8px',
      marginLeft: '-8px'
    },
    '& .WelcomeDashboard-cardColumn': {
      flex: '0 0 100%',
      maxWidth: '100%',
      margin: '8px',

      '& .WelcomeDashboard-card': {
        position: 'relative',
        minWidth: 0,
        wordWrap: 'break-word',
        backgroundColor: '#ffffff',
        color: '#000000',
        backgroundClip: 'border-box',
        border: '1px solid #000000',
        borderRadius: 0,
        marginTop: 8,

        '& .WelcomeDashboard-cardHeader': {
          padding: '0.25rem 0.5rem',
          fontWeight: 'bold',
          backgroundColor: '#000000',
          color: '#ffffff',
          borderBottom: '1px solid',
          borderBottomColor: '#000000',
        },
        '& .WelcomeDashboard-cardBody': {
          flex: '1 1 auto',
          minHeight: '1px',
          padding: '0.5rem !important',

          '& .WelcomeDashboard-welcomeLogo': {
            width: '100%',
            color: '#000000',
            '& .app-name, & .app-name-underline, & .app-tagline': {
              fill: '#000000',
              stroke: '#000000'
            }
          },

          '& .WelcomeDashboard-rowContent': {
            display: 'flex',
            flexWrap: 'wrap',
            marginRight: '-7.5px',
            marginLeft: '-7.5px',

            '& .WelcomeDashboard-dashboardLink': {
              color: '#000000 !important',
              flex: '0 0 50%',
              maxWidth: '50%',
              textAlign: 'center',
              cursor: 'pointer',

              '& .WelcomeDashboard-link': {
                color: '#000000 !important',

                '& .WelcomeDashboard-dashboardIcon': {
                  color: '#000000'
                }
              },
            },

            '& .WelcomeDashboard-gettingStartedLink': {
              flex: '0 0 25%',
              maxWidth: '50%',
              textAlign: 'center',
              cursor: 'pointer',

              '& .WelcomeDashboard-link': {
                color: '#000000 !important',

                '& .WelcomeDashboard-dashboardIcon': {
                  color: '#000000'
                }
              },
            },
          },
        },
      },
    },
  },
}));


function AddNewServer(pgBrowser) {
  if (pgBrowser?.tree) {
    let i = _.isUndefined(pgBrowser.tree.selected()) ?
        pgBrowser.tree.first(null, false) :
        pgBrowser.tree.selected(),
      serverModule = pgAdmin.Browser.Nodes.server,
      itemData = pgBrowser.tree.itemData(i);

    while (itemData && itemData._type != 'server_group') {
      i = pgBrowser.tree.next(i);
      itemData = pgBrowser.tree.itemData(i);
    }

    if (!itemData) {
      return;
    }

    if (serverModule) {
      serverModule.callbacks.show_obj_properties.apply(
        serverModule, [{
          action: 'create',
        }, i]
      );
    }
  }
}

export default function WelcomeDashboard({ pgBrowser }) {
  return (
    <Root>
      <div className='WelcomeDashboard-dashboardContainer'>
        <div className='WelcomeDashboard-row'>
          <div className='WelcomeDashboard-cardColumn'>
            <div className='WelcomeDashboard-card'>
              <div className='WelcomeDashboard-cardHeader'>{gettext('Welcome')}</div>
              <div className='WelcomeDashboard-cardBody'>
                <div className='WelcomeDashboard-welcomeLogo'>
                  <OrcaDbPanelLogo />
                </div>
                <h4>
                  {gettext('Database Administration')} | {gettext('Private System')}{' '}
                  | {gettext('Open Source')}{' '}
                </h4>
                <p>
                  {gettext(
                    'ORCA DB PANEL is an Open Source administration and management tool for the PostgreSQL database. It includes a graphical administration interface, an SQL query tool, a procedural code debugger and much more. The tool is designed to answer the needs of developers, DBAs and system administrators alike.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='WelcomeDashboard-row'>
          <div className='WelcomeDashboard-cardColumn'>
            <div className='WelcomeDashboard-card'>
              <div className='WelcomeDashboard-cardHeader'>{gettext('Quick Links')}</div>
              <div className='WelcomeDashboard-cardBody'>
                <div className='WelcomeDashboard-rowContent'>
                  <div className='WelcomeDashboard-dashboardLink'>
                    <Link onClick={() => { AddNewServer(pgBrowser); }} className='WelcomeDashboard-link'>
                      <div className='WelcomeDashboard-dashboardIcon'>
                        <span
                          className="fa fa-4x fa-server"
                          aria-hidden="true"
                        ></span>
                      </div>
                      {gettext('Add New Server')}
                    </Link>
                  </div>
                  <div className='WelcomeDashboard-dashboardLink'>
                    <Link onClick={() => pgAdmin.Preferences.show()} className='WelcomeDashboard-link'>
                      <div className='WelcomeDashboard-dashboardIcon'>
                        <span
                          id="mnu_preferences"
                          className="fa fa-4x fa-cogs"
                          aria-hidden="true"
                        ></span>
                      </div>
                      {gettext('Configure ORCA DB PANEL')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='WelcomeDashboard-row'>
          <div className='WelcomeDashboard-cardColumn'>
            <div className='WelcomeDashboard-card'>
              <div className='WelcomeDashboard-cardHeader'>{gettext('Getting Started')}</div>
              <div className='WelcomeDashboard-cardBody'>
                <div className='WelcomeDashboard-rowContent'>
                  <div className='WelcomeDashboard-gettingStartedLink'>
                    <a
                      href="https://www.postgresql.org/docs"
                      target="postgres_help"
                      className='WelcomeDashboard-link'
                    >
                      <div className='WelcomeDashboard-dashboardIcon'>
                        <span
                          className="fa fa-4x dashboard-pg-doc"
                          aria-hidden="true"
                        ></span>
                      </div>
                      {gettext('PostgreSQL Documentation')}
                    </a>
                  </div>
                  <div className='WelcomeDashboard-gettingStartedLink'>
                    <a href="https://github.com/satviksingh0828-wq/orca-db-panel" target="orca_db_panel_website" className='WelcomeDashboard-link'>
                      <div className='WelcomeDashboard-dashboardIcon'>
                        <span
                          className="fa fa-4x fa-globe"
                          aria-hidden="true"
                        ></span>
                      </div>
                      {gettext('ORCA DB PANEL Website')}
                    </a>
                  </div>
                  <div className='WelcomeDashboard-gettingStartedLink'>
                    <a
                      href="https://planet.postgresql.org"
                      target="planet_website"
                      className='WelcomeDashboard-link'
                    >
                      <div className='WelcomeDashboard-dashboardIcon'>
                        <span
                          className="fa fa-4x fa-book"
                          aria-hidden="true"
                        ></span>
                      </div>
                      {gettext('Planet PostgreSQL')}
                    </a>
                  </div>
                  <div className='WelcomeDashboard-gettingStartedLink'>
                    <a
                      href="https://www.postgresql.org/community"
                      target="postgres_website"
                      className='WelcomeDashboard-link'
                    >
                      <div className='WelcomeDashboard-dashboardIcon'>
                        <span
                          className="fa fa-4x fa-users"
                          aria-hidden="true"
                        ></span>
                      </div>
                      {gettext('Community Support')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Root>
  );
}


WelcomeDashboard.propTypes = {
  pgBrowser: PropTypes.object.isRequired
};
