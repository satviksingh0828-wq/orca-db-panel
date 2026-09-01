import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect, useRef } from 'react';
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
  const backgroundVideoRef = useRef(null);

  useEffect(() => {
    const video = backgroundVideoRef.current;
    const canvas = document.createElement('canvas');

    // Keep the animation local to the application. The previous Pixabay URL
    // was blocked by common CSP/network configurations, leaving a blank login
    // background. A canvas stream retains the video treatment without relying
    // on a third-party asset at sign-in time.
    if (!video || !canvas.captureStream) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    canvas.width = 960;
    canvas.height = 540;
    let frameId;
    const renderFrame = (timestamp) => {
      const progress = timestamp / 1000;
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#dbeafe');
      gradient.addColorStop(0.5, '#e0f2fe');
      gradient.addColorStop(1, '#f0f9ff');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      [[180, 140, 150, '#60a5fa'], [760, 380, 210, '#38bdf8'], [500, 80, 110, '#93c5fd']]
        .forEach(([x, y, radius, color], index) => {
          const offset = Math.sin(progress * 0.45 + index) * 55;
          const glow = context.createRadialGradient(x + offset, y, 0, x + offset, y, radius);
          glow.addColorStop(0, `${color}80`);
          glow.addColorStop(1, `${color}00`);
          context.fillStyle = glow;
          context.beginPath();
          context.arc(x + offset, y, radius, 0, Math.PI * 2);
          context.fill();
        });
      frameId = requestAnimationFrame(renderFrame);
    };

    const stream = canvas.captureStream(24);
    video.srcObject = stream;
    video.play().catch(() => {});
    frameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(frameId);
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };
  }, []);

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
      <video ref={backgroundVideoRef} className='BasePage-bgVideo' autoPlay loop muted playsInline aria-hidden="true" tabIndex="-1" />
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
