@ECHO OFF
SETLOCAL

SET BASE_DIR=%~dp0
SET WRAPPER_PROPERTIES=%BASE_DIR%.mvn\wrapper\maven-wrapper.properties

IF NOT EXIST "%WRAPPER_PROPERTIES%" (
  ECHO Missing %WRAPPER_PROPERTIES%
  EXIT /B 1
)

FOR /F "tokens=1,* delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
  IF "%%A"=="distributionUrl" SET DISTRIBUTION_URL=%%B
)

IF "%DISTRIBUTION_URL%"=="" (
  ECHO distributionUrl is not configured in %WRAPPER_PROPERTIES%
  EXIT /B 1
)

ECHO Please use Git Bash/WSL and run ./mvnw on Windows in this MVP baseline.
ECHO mvnw.cmd bootstrap is intentionally minimal in Phase 0.
EXIT /B 1
