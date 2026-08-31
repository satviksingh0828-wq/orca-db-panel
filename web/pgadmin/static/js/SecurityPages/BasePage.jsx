import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { MESSAGE_TYPE, NotifierMessage } from '../components/FormComponents';
import { FinalNotifyContent } from '../helpers/Notifier';
import PropTypes from 'prop-types';
import CustomPropTypes from '../custom_prop_types';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#000000',
  color: '#000000',
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
    filter: 'grayscale(1) contrast(1.15) brightness(0.42)',
  },
  '& .BasePage-bgVeil': {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.42)',
  },
  '& .BasePage-layout': {
    position: 'relative',
    zIndex: 1,
  },
  '& .BasePage-pageContent': {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    borderRadius: 0,
    boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.95)',
    maxHeight: '100%',
    minWidth: '450px',
    maxWidth: '450px',
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
      backgroundColor: '#000000',
      border: '2px solid #000000',
      color: '#ffffff',
      padding: '8px',
      width: '100%',
      borderRadius: 0,
      '&:hover, &:focus, &:active': {
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        color: '#000000',
      },
      '&.Mui-disabled': {
        backgroundColor: '#000000',
        borderColor: '#000000',
        color: '#ffffff',
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
