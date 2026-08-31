//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2026, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

export default function PgAdminLogo() {
  return (
    <div className="welcome-logo orca-welcome-logo" aria-label="ORCA DB PANEL">
      <img src="/static/img/orca-logo.png" alt="ORCA DB PANEL logo" />
      <div className="orca-welcome-wordmark">ORCA DB PANEL</div>
    </div>
  );
}
