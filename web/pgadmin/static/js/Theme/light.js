/////////////////////////////////////////////////////////////
//
// ORCA DB PANEL
//
// Copyright (C) 2013 - 2026, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

/* ORCA DB PANEL monochrome theme */
import { createTheme } from '@mui/material/styles';

export default function(basicSettings) {
  return createTheme(basicSettings, {
    name: 'light',
    palette: {
      default: {
        main: '#ffffff',
        contrastText: '#000000',
        borderColor: '#000000',
        disabledBorderColor: '#000000',
        disabledContrastText: '#000000',
        hoverMain: '#000000',
        hoverContrastText: '#ffffff',
        hoverBorderColor: '#000000',
      },
      primary: {
        main: '#000000',
        light: '#ffffff',
        contrastText: '#ffffff',
        contrastTextLight: '#ffffff',
        hoverMain: '#ffffff',
        hoverBorderColor: '#000000',
        hoverLight: '#ffffff',
        disabledMain: '#000000',
      },
      success:  {
        main: '#000000',
        light: '#ffffff',
        contrastText: '#ffffff',
      },
      error: {
        main: '#000000',
        light: '#ffffff',
        contrastText: '#ffffff',
        hoverMain: '#ffffff',
        hoverBorderColor: '#000000',
      },
      warning: {
        main: '#000000',
        light: '#ffffff',
        contrastText: '#ffffff',
        hoverMain: '#ffffff',
        hoverBorderColor: '#000000',
      },
      info: {
        main: '#000000',
      },
      grey: {
        '200': '#ffffff',
        '400': '#ffffff',
        '600': '#000000',
        '800': '#000000',
        '900': '#000000',
      },
      text: {
        primary: '#000000',
        muted: '#000000',
      },
      background: {
        paper: '#ffffff',
        default: '#ffffff',
      },
    },
    custom: {
      checkbox: {
        borderColor: '#000000',
        disabled: '#ffffff'
      },
      icon: {
        main: '#ffffff',
        contrastText: '#000000',
        borderColor: '#000000',
        disabledMain: '#ffffff',
        disabledContrastText: '#000000',
        disabledBorderColor: '#000000',
        hoverMain: '#000000',
        hoverContrastText: '#ffffff',
      }
    },
    otherVars: {
      colorBrand: '#000000',
      hyperlinkColor: '#000000',
      iconLoaderUrl: 'url("/static/img/orca-logo.svg")',
      iconLoaderSmall: 'url("/static/img/orca-logo.svg")',
      dashboardPgDoc: 'url("/static/img/orca-logo.svg")',
      reactSelect: {
        padding: '5px 8px'
      },
      borderColor: '#000000',
      loader: {
        backgroundColor: '#000000',
        color: '#ffffff'
      },
      errorColor: '#000000',
      inputBorderColor: '#000000',
      inputDisabledBg: '#ffffff',
      headerBg: '#000000',
      activeBorder: '#000000',
      activeColor: '#000000',
      tableBg: '#ffffff',
      activeStepBg: '#000000',
      activeStepFg: '#ffffff',
      stepBg: '#ffffff',
      stepFg: '#000000',
      toggleBtnBg: '#000000',
      editorToolbarBg: '#ffffff',
      qtDatagridBg: '#ffffff',
      qtDatagridSelectFg: '#ffffff',
      cardHeaderBg: '#000000',
      emptySpaceBg: '#ffffff',
      textMuted: '#000000',
      erdCanvasBg: '#ffffff',
      erdGridColor: '#000000',
      noteBg: '#ffffff',
      explain: {
        sev2: {
          color: '#000000',
          bg: '#ffffff'
        },
        sev3: {
          color: '#ffffff',
          bg: '#000000'
        },
        sev4: {
          color: '#ffffff',
          bg: '#000000'
        }
      },
      scroll: {
        baseColor: '#000000',
        barBackgroundColor: '#000000',
        thumbBackground: '#000000'
      },
      schemaDiff: {
        diffRowColor: '#ffffff',
        sourceRowColor: '#ffffff',
        targetRowColor: '#ffffff',
        diffColorFg: '#000000',
        diffSelectFG: '#ffffff',
        diffSelCheckbox: '#000000'
      },
      editor: {
        fg: '#000000',
        bg: '#ffffff',
        selectionBg: '#000000',
        keyword: '#000000',
        number: '#000000',
        string: '#000000',
        variable: '#000000',
        type: '#000000',
        comment: '#000000',
        punctuation: '#000000',
        operator: '#000000',
        name: '#000000',
        foldmarker: '#000000',
        activeline: '#ffffff',
        activelineLight: '#ffffff',
        currentQueryBorderColor: '#000000',
        guttersBg: '#ffffff',
        guttersFg: '#000000',
      },
      tree: {
        textFg: '#000000',
        inputBg: '#ffffff',
        fgHover: '#ffffff',
        bgHover: '#000000',
        textHoverFg: '#ffffff',
        bgSelected: '#000000'
      }
    }
  });
}
