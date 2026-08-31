//
// ORCA DB PANEL
//
// Copyright (C) 2013 - 2026, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

export default function OrcaDbPanelLogo() {
  return (
    <div className="welcome-logo orca-welcome-logo" aria-label="ORCA DB PANEL">
      <img src="/static/img/orca-logo.svg" alt="ORCA DB PANEL logo" />
      <div className="orca-welcome-copy">
        <div className="orca-welcome-wordmark">ORCA DB PANEL</div>
        <div className="orca-welcome-tagline">PRIVATE DATABASE CONTROL CENTER</div>
      </div>
    </div>
  );
}
