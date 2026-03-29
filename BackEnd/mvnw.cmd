@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM M2_HOME - location of maven's installed home (default is %MAVEN_BASEDIR%\..\apache-maven)
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM 
@REM Begin all REM lines with '@' in case MAVEN_BATCH_ECHO is 'on'
@echo off
@REM set title of command window
title %0
@REM enable echoing by setting MAVEN_BATCH_ECHO to 'on'
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_CMD_LINE%
@REM set %date /a % and %time% variables
@for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (set day=%%d&set month=%%a&set year=%%c)
@for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set hour=%%a&set minute=%%b)
@REM Looks for the wrapper across directory levels
@if "%MAVEN_PROJECTBASEDIR%"=="" (
  set MAVEN_PROJECTBASEDIR=%CD%
  :mavenfind
  if exist "%MAVEN_PROJECTBASEDIR%\mvnw" goto mavenrunning
  cd ..
  if "%MAVEN_PROJECTBASEDIR%"=="%CD%\" goto mavenfinished
  set MAVEN_PROJECTBASEDIR=%CD%
  goto mavenfind
)
:mavenrunning
setlocal
set MAVEN_FORKMODE=true
set MAVEN_PROJECTBASEDIR=%~dp0
cd /d "%MAVEN_PROJECTBASEDIR%"
if exist "%MAVEN_PROJECTBASEDIR%.mvn\jvm.config" (
  for /f "delims=" %%a in ('type "%MAVEN_PROJECTBASEDIR%.mvn\jvm.config"') do set JVM_CONFIG_MAVEN_PROPS=!JVM_CONFIG_MAVEN_PROPS! %%a
)
set MAVEN_JAVA_EXE=%JAVA_HOME%\bin\java.exe
if not exist "%MAVEN_JAVA_EXE%" (
  echo.
  echo Error: JAVA_HOME is not defined correctly in %0 >&2
  echo Please set the JAVA_HOME variable in your environment to match the
  echo location of your Java installation.
  echo.
  goto error
)
if exist "%MAVEN_PROJECTBASEDIR%\.mvn" (
  set MAVEN_HOME=%MAVEN_PROJECTBASEDIR%\.mvn
) else (
  for /f "delims=" %%a in ('powershell -Command "$pref = $PSVersionTable.PSVersion.Major; if ($pref -ge 3) { $response = Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile '%TEMP%\maven.zip' -PassThru; if ($response.StatusCode -eq 200) { Exit 0 } } Exit 1"') do (
    set MAVEN_DOWNLOAD_STATUS=%%a
  )
  if "!MAVEN_DOWNLOAD_STATUS!"=="1" (
    echo Could not download Maven. Please install Maven manually.
    goto error
  )
)
set MAVEN_CMD_LINE_ARGS=%*
goto mavenfinished
:mavenfinished
endlocal
goto end
:error
exit /b 1
:end
@endlocal
