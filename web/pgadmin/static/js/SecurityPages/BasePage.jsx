import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { MESSAGE_TYPE, NotifierMessage } from '../components/FormComponents';
import { FinalNotifyContent } from '../helpers/Notifier';
import PropTypes from 'prop-types';
import CustomPropTypes from '../custom_prop_types';

const StyledBox = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  '& .BasePage-bgVideo': {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(1) contrast(1.05) brightness(0.9)',
  },
  '& .BasePage-bgVeil': {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.72)',
  },
  '& .BasePage-layout': {
    position: 'relative',
    zIndex: 1,
  },
  '& .BasePage-pageContent': {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.otherVars.borderColor}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 12px 32px rgba(31, 41, 55, .14)',
    maxHeight: '100%',
    minWidth: 0,
    width: 'min(430px, calc(100vw - 32px))',
    maxWidth: '430px',
    '& .BasePage-item': {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px',
      fontSize: '1.2rem',
      '& .BasePage-logo': {
        width: '180px',
        height: '72px',
        background: 'url("/static/img/orca-logo.svg") center / contain no-repeat',
      },
    },
    '& .BasePage-button': {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${theme.otherVars.borderColor}`,
      color: theme.palette.primary.contrastText,
      padding: '8px',
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      '&:hover, &:focus, &:active': {
        backgroundColor: theme.palette.primary.hoverMain,
        borderColor: theme.otherVars.activeBorder,
        color: theme.palette.primary.contrastText,
      },
      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        borderColor: theme.otherVars.borderColor,
        color: theme.palette.text.disabled,
      },
    },
  },
}));

export function SecurityButton({...props}) {
  return <Button type="submit" className='BasePage-button' {...props} />;
}

export default function BasePage({pageImage, title, children, messages}) {
  const snackbar = useSnackbar();
  useEffect(()=>{
    messages?.forEach((message)=>{
      let options = {
        autoHideDuration: null,
        content:(key)=>{
          if(Array.isArray(message[0])) message[0] = message[0][0];
          const type = Object.values(MESSAGE_TYPE).includes(message[0]) ? message[0] : MESSAGE_TYPE.INFO;
          return <FinalNotifyContent>
            <NotifierMessage type={type} message={message[1]} closable={true} onClose={()=>{snackbar.closeSnackbar(key);}} style={{maxWidth: '400px'}} />
          </FinalNotifyContent>;
        }
      };
      options.content.displayName = 'content';
      snackbar.enqueueSnackbar(options);
    });
  }, [messages]);
  return (
    <StyledBox className='orca-security-shell' data-test="security-page">
      <video className='BasePage-bgVideo' autoPlay loop muted playsInline aria-hidden="true" tabIndex="-1">
        <source src="https://cdn.pixabay.com/video/2023/10/15/185135-874643460_large.mp4" type="video/mp4" />
      </video>
      <div className='BasePage-bgVeil' aria-hidden="true" />
      <Box className='BasePage-layout' display="flex" minWidth="80%" gap="40px" alignItems="center" justifyContent="center" padding="20px 80px">
        <Box className='BasePage-illustration' aria-hidden="true" sx={{display: 'none'}}>
          {pageImage}
        </Box>
        <Box className='BasePage-pageContent'>
          <Box className='BasePage-item'>
            <div className='BasePage-logo' aria-label="ORCA DB logo" role="img" />
          </Box>
          <Box className='BasePage-item' sx={{flexDirection: 'column', gap: '4px'}}>
            <span style={{fontWeight: 800, letterSpacing: '0.12em'}}>ORCA DB</span>
            <span style={{fontSize: '0.68rem', letterSpacing: '0.16em'}}>SECURE DATABASE WORKSPACE</span>
          </Box>
          <Box className='BasePage-item'>{title}</Box>
          <Box display="flex" flexDirection="column" minHeight={0}>{children}</Box>
        </Box>
      </Box>
    </StyledBox>
  );
}

BasePage.propTypes = {
  pageImage: CustomPropTypes.children,
  title: PropTypes.string,
  children: CustomPropTypes.children,
  messages: PropTypes.arrayOf(PropTypes.array)
};
