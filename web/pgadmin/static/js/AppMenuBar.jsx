//
// ORCA DB PANEL
//
// Copyright (C) 2013 - 2026, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { PrimaryButton } from './components/Buttons';
import { PgMenu, PgMenuDivider, PgMenuItem, PgSubMenu } from './components/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { usePgAdmin } from '../../static/js/PgAdminProvider';
import { useForceUpdate } from './custom_hooks';

const StyledBox = styled(Box)(() => ({
  height: '42px',
  backgroundColor: '#ffffff',
  color: '#000000',
  borderBottom: '2px solid #000000',
  padding: '0 0.75rem',
  display: 'flex',
  alignItems: 'center',
  '& .AppMenuBar-brand': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '210px',
    height: '100%',
  },
  '& .AppMenuBar-logo': {
    width: '30px',
    height: '30px',
    flex: '0 0 30px',
    background: 'url("/static/img/orca-logo.svg") center / contain no-repeat',
  },
  '& .AppMenuBar-wordmark': {
    color: '#000000',
    fontSize: '0.9rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
  },
  '& .AppMenuBar-menus': {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginLeft: '16px',
    '& .MuiButton-root': {
      color: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderRadius: 0,
    },
    '& .MuiButton-root:hover, & .MuiButton-root:focus, & .MuiButton-root:active': {
      color: '#ffffff',
      backgroundColor: '#000000',
      borderColor: '#000000',
    },
  },
  '& .AppMenuBar-userMenu': {
    marginLeft: 'auto',
    '& .MuiButton-root': {
      color: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderRadius: 0,
      fontSize: '0.825rem',
    },
    '& .MuiButton-root:hover, & .MuiButton-root:focus, & .MuiButton-root:active': {
      color: '#ffffff',
      backgroundColor: '#000000',
      borderColor: '#000000',
    },
    '& .AppMenuBar-gravatar': {
      marginRight: '4px',
    },
  },
}));

export default function AppMenuBar() {
  const forceUpdate = useForceUpdate();
  const pgAdmin = usePgAdmin();

  useEffect(()=>{
    pgAdmin.Browser.Events.on('pgadmin:enable-disable-menu-items', _.debounce(()=>{
      forceUpdate();
    }, 100));
    pgAdmin.Browser.Events.on('pgadmin:refresh-app-menu', _.debounce(()=>{
      forceUpdate();
    }, 100));
  }, []);

  const getPgMenuItem = (menuItem, i)=>{
    if(menuItem.type == 'separator') {
      return <PgMenuDivider key={i}/>;
    }
    const hasCheck = typeof menuItem.checked == 'boolean';

    return <PgMenuItem
      key={i}
      disabled={menuItem.isDisabled}
      onClick={()=>{
        menuItem.callback();
        if(hasCheck) {
          forceUpdate();
        }
      }}
      hasCheck={hasCheck}
      checked={menuItem.checked}
      closeOnCheck={true}
      shortcut={menuItem.shortcut}
    >{menuItem.label}</PgMenuItem>;
  };

  const userMenuInfo = pgAdmin.Browser.utils.userMenuInfo;

  const getPgMenu = (menu)=>{
    return menu.getMenuItems()?.map((menuItem, i)=>{
      const submenus = menuItem.getMenuItems();
      if(submenus) {
        return <PgSubMenu key={menuItem.label} label={menuItem.label}>
          {getPgMenu(menuItem)}
        </PgSubMenu>;
      }
      return getPgMenuItem(menuItem, i);
    });
  };

  return (
    <StyledBox data-test="app-menu-bar">
      <div className='AppMenuBar-brand' aria-label="ORCA DB PANEL">
        <div className='AppMenuBar-logo' aria-hidden="true" />
        <span className='AppMenuBar-wordmark'>ORCA DB PANEL</span>
      </div>
      <div className='AppMenuBar-menus'>
        {pgAdmin.Browser.MainMenus?.map((menu)=>{
          return (
            <PgMenu
              menuButton={
                <PrimaryButton key={menu.label} data-label={menu.label}>
                  {menu.label}<KeyboardArrowDownIcon fontSize="small" />
                </PrimaryButton>
              }
              label={menu.label}
              key={menu.name}
            >
              {getPgMenu(menu)}
            </PgMenu>
          );
        })}
      </div>
      {userMenuInfo &&
        <div className='AppMenuBar-userMenu'>
          <PgMenu
            menuButton={
              <PrimaryButton data-test="loggedin-username">
                <div className='AppMenuBar-gravatar'>
                  {userMenuInfo.gravatar &&
                  <img src={userMenuInfo.gravatar} width="18" height="18"
                    alt={`Gravatar for ${userMenuInfo.username}`} />}
                  {!userMenuInfo.gravatar && <AccountCircleRoundedIcon />}
                </div>
                {userMenuInfo.username} ({userMenuInfo.auth_source})
                <KeyboardArrowDownIcon fontSize="small" />
              </PrimaryButton>
            }
            label={userMenuInfo.username}
            align="end"
          >
            {userMenuInfo.menus.map((menuItem, i)=>{
              return getPgMenuItem(menuItem, i);
            })}
          </PgMenu>
        </div>}
    </StyledBox>
  );
}
