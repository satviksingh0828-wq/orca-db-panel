import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { MESSAGE_TYPE, NotifierMessage } from '../components/FormComponents';
import { FinalNotifyContent } from '../helpers/Notifier';
import PropTypes from 'prop-types';
import CustomPropTypes from '../custom_prop_types';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#ffffff',
  color: '#000000',
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  '& .BasePage-pageContent': {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: 0,
    boxShadow: 'none',
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
      border: '1px solid #000000',
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
      <Box display="flex" minWidth="80%" gap="40px" alignItems="center" justifyContent="center" padding="20px 80px">
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
