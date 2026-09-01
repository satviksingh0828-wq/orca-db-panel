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
        contrastText: '#1f2937',
        borderColor: '#1f2937',
        disabledBorderColor: '#1f2937',
        disabledContrastText: '#1f2937',
        hoverMain: '#dbeafe',
        hoverContrastText: '#111827',
        hoverBorderColor: '#1f2937',
      },
      primary: {
        main: '#e5e7eb',
        light: '#ffffff',
        contrastText: '#111827',
        contrastTextLight: '#111827',
        hoverMain: '#ffffff',
        hoverBorderColor: '#1f2937',
        hoverLight: '#ffffff',
        disabledMain: '#e5e7eb',
      },
      success:  {
        main: '#e5e7eb',
        light: '#ffffff',
        contrastText: '#111827',
      },
      error: {
        main: '#e5e7eb',
        light: '#ffffff',
        contrastText: '#111827',
        hoverMain: '#ffffff',
        hoverBorderColor: '#1f2937',
      },
      warning: {
        main: '#e5e7eb',
        light: '#ffffff',
        contrastText: '#111827',
        hoverMain: '#ffffff',
        hoverBorderColor: '#1f2937',
      },
      info: {
        main: '#e5e7eb',
      },
      grey: {
        '200': '#ffffff',
        '400': '#ffffff',
        '600': '#1f2937',
        '800': '#1f2937',
        '900': '#1f2937',
      },
      text: {
        primary: '#1f2937',
        muted: '#1f2937',
      },
      background: {
        paper: '#ffffff',
        default: '#ffffff',
      },
    },
    custom: {
      checkbox: {
        borderColor: '#1f2937',
        disabled: '#ffffff'
      },
      icon: {
        main: '#ffffff',
        contrastText: '#1f2937',
        borderColor: '#1f2937',
        disabledMain: '#ffffff',
        disabledContrastText: '#1f2937',
        disabledBorderColor: '#1f2937',
        hoverMain: '#dbeafe',
        hoverContrastText: '#111827',
      }
    },
    otherVars: {
      colorBrand: '#1f2937',
      hyperlinkColor: '#1f2937',
      iconLoaderUrl: 'url("/static/img/orca-logo.svg")',
      iconLoaderSmall: 'url("/static/img/orca-logo.svg")',
      dashboardPgDoc: 'url("/static/img/orca-logo.svg")',
      reactSelect: {
        padding: '5px 8px'
      },
      borderColor: '#1f2937',
      loader: {
        backgroundColor: '#e5e7eb',
        color: '#111827'
      },
      errorColor: '#1f2937',
      inputBorderColor: '#1f2937',
      inputDisabledBg: '#ffffff',
      headerBg: '#e5e7eb',
      activeBorder: '#1f2937',
      activeColor: '#1f2937',
      tableBg: '#ffffff',
      activeStepBg: '#dbeafe',
      activeStepFg: '#111827',
      stepBg: '#ffffff',
      stepFg: '#1f2937',
      toggleBtnBg: '#e5e7eb',
      editorToolbarBg: '#ffffff',
      qtDatagridBg: '#ffffff',
      qtDatagridSelectFg: '#111827',
      cardHeaderBg: '#e5e7eb',
      emptySpaceBg: '#ffffff',
      textMuted: '#1f2937',
      erdCanvasBg: '#ffffff',
      erdGridColor: '#1f2937',
      noteBg: '#ffffff',
      explain: {
        sev2: {
          color: '#1f2937',
          bg: '#ffffff'
        },
        sev3: {
          color: '#111827',
          bg: '#f3f4f6'
        },
        sev4: {
          color: '#111827',
          bg: '#f3f4f6'
        }
      },
      scroll: {
        baseColor: '#1f2937',
        barBackgroundColor: '#e5e7eb',
        thumbBackground: '#c7ced8'
      },
      schemaDiff: {
        diffRowColor: '#ffffff',
        sourceRowColor: '#ffffff',
        targetRowColor: '#ffffff',
        diffColorFg: '#1f2937',
        diffSelectFG: '#111827',
        diffSelCheckbox: '#1f2937'
      },
      editor: {
        fg: '#1f2937',
        bg: '#ffffff',
        selectionBg: '#1f2937',
        keyword: '#1f2937',
        number: '#1f2937',
        string: '#1f2937',
        variable: '#1f2937',
        type: '#1f2937',
        comment: '#1f2937',
        punctuation: '#1f2937',
        operator: '#1f2937',
        name: '#1f2937',
        foldmarker: '#1f2937',
        activeline: '#ffffff',
        activelineLight: '#ffffff',
        currentQueryBorderColor: '#1f2937',
        guttersBg: '#ffffff',
        guttersFg: '#1f2937',
      },
      tree: {
        textFg: '#1f2937',
        inputBg: '#ffffff',
        fgHover: '#111827',
        bgHover: '#e5e7eb',
        textHoverFg: '#111827',
        bgSelected: '#dbeafe'
      }
    }
  });
}
