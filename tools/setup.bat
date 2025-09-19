@echo off
REM MetaForge Pro 自动安装脚本 (Windows)
REM 版本: 1.0
REM 作者: MetaForge Pro Team

setlocal enabledelayedexpansion

REM 颜色定义 (Windows 10+)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "NC=[0m"

REM 初始化变量
set "INSTALL_MODE="
set "PROJECT_NAME="
set "PROJECT_DIR="
set "TEMP_DIR=%TEMP%\metaforge_%RANDOM%"

echo.
echo %BLUE%==================================
echo   MetaForge Pro 自动安装脚本
echo ==================================%NC%
echo.

REM 检查系统要求
call :check_system
call :check_cursor
call :choose_install_method
call :download_metaforge
call :install_framework
call :create_project_config
call :verify_installation
call :show_next_steps

goto :cleanup

REM ====== 函数定义 ======

:log
echo %GREEN%[INFO]%NC% %~1
goto :eof

:warn
echo %YELLOW%[WARN]%NC% %~1
goto :eof

:error
echo %RED%[ERROR]%NC% %~1
pause
exit /b 1

:success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:check_system
call :log "检查系统环境..."

REM 检查Windows版本
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
call :log "检测到 Windows 版本: %VERSION%"

REM 检查必需工具
where curl >nul 2>&1
if errorlevel 1 (
    call :error "需要安装 curl。请从 https://curl.se/windows/ 下载"
)

where powershell >nul 2>&1
if errorlevel 1 (
    call :error "需要 PowerShell"
)

call :log "系统环境检查完成"
goto :eof

:check_cursor
call :log "检查 Cursor 编辑器..."

REM 检查Cursor是否安装
where cursor >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=*" %%i in ('cursor --version 2^>nul') do set CURSOR_VERSION=%%i
    call :log "检测到 Cursor: !CURSOR_VERSION!"
    goto :cursor_found
)

REM 检查常见安装路径
if exist "%LOCALAPPDATA%\Programs\cursor\Cursor.exe" (
    call :log "检测到 Cursor 在本地安装目录"
    goto :cursor_found
)

if exist "%PROGRAMFILES%\Cursor\Cursor.exe" (
    call :log "检测到 Cursor 在程序文件目录"
    goto :cursor_found
)

call :warn "未检测到 Cursor 编辑器"
echo 请从以下地址下载安装 Cursor:
echo https://cursor.sh/
set /p cursor_installed="已安装 Cursor? (y/n): "
if /i not "!cursor_installed!"=="y" (
    call :error "请先安装 Cursor 编辑器"
)

:cursor_found
goto :eof

:choose_install_method
echo.
echo %BLUE%选择安装方式:%NC%
echo 1^) 新项目安装 ^(创建新项目目录^)
echo 2^) 现有项目安装 ^(在当前目录安装^)
echo 3^) 自定义路径安装
echo.
set /p install_choice="请选择 (1-3): "

if "%install_choice%"=="1" (
    set "INSTALL_MODE=new_project"
    set /p PROJECT_NAME="请输入项目名称: "
    if "!PROJECT_NAME!"=="" (
        call :error "项目名称不能为空"
    )
    set "PROJECT_DIR=%CD%\!PROJECT_NAME!"
) else if "%install_choice%"=="2" (
    set "INSTALL_MODE=existing_project"
    set "PROJECT_DIR=%CD%"
) else if "%install_choice%"=="3" (
    set "INSTALL_MODE=custom_path"
    set /p custom_path="请输入安装路径: "
    set "PROJECT_DIR=!custom_path!"
) else (
    call :error "无效选择"
)
goto :eof

:download_metaforge
call :log "下载 MetaForge Pro 框架..."

REM 创建临时目录
mkdir "%TEMP_DIR%" 2>nul

REM 下载框架
set "DOWNLOAD_URL=https://github.com/your-org/MetaForge-Pro/archive/main.zip"
call :log "正在下载..."

powershell -Command "try { Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%TEMP_DIR%\metaforge.zip' -TimeoutSec 30 } catch { exit 1 }"
if errorlevel 1 (
    call :error "下载失败，请检查网络连接"
)

REM 解压文件
call :log "解压框架文件..."
powershell -Command "try { Expand-Archive -Path '%TEMP_DIR%\metaforge.zip' -DestinationPath '%TEMP_DIR%' -Force } catch { exit 1 }"
if errorlevel 1 (
    call :error "解压失败"
)

set "METAFORGE_SOURCE=%TEMP_DIR%\MetaForge-Pro-main"
if not exist "%METAFORGE_SOURCE%" (
    call :error "框架文件结构异常"
)

call :success "框架下载完成"
goto :eof

:install_framework
call :log "安装 MetaForge Pro 框架到 %PROJECT_DIR%..."

REM 创建项目目录 (如果需要)
if "%INSTALL_MODE%"=="new_project" (
    if exist "%PROJECT_DIR%" (
        call :warn "目录 %PROJECT_DIR% 已存在"
        set /p continue_install="是否继续安装? (y/n): "
        if /i not "!continue_install!"=="y" (
            call :error "安装取消"
        )
    ) else (
        mkdir "%PROJECT_DIR%" 2>nul
        if errorlevel 1 (
            call :error "创建目录失败: %PROJECT_DIR%"
        )
    )
)

if "%INSTALL_MODE%"=="custom_path" (
    if not exist "%PROJECT_DIR%" (
        mkdir "%PROJECT_DIR%" 2>nul
        if errorlevel 1 (
            call :error "创建目录失败: %PROJECT_DIR%"
        )
    )
)

REM 复制.cursor目录
call :log "复制 MetaForge 核心文件..."
robocopy "%METAFORGE_SOURCE%\.cursor" "%PROJECT_DIR%\.cursor" /E /NFL /NDL /NJH /NJS >nul
if errorlevel 8 (
    call :error "复制 .cursor 目录失败"
)

REM 复制README文件作为参考
if not exist "%PROJECT_DIR%\README.md" (
    copy "%METAFORGE_SOURCE%\README.md" "%PROJECT_DIR%\MetaForge-README.md" >nul 2>&1
)

REM 复制示例文件 (可选)
set /p copy_examples="是否复制示例项目? (y/n): "
if /i "%copy_examples%"=="y" (
    mkdir "%PROJECT_DIR%\examples" 2>nul
    robocopy "%METAFORGE_SOURCE%\examples" "%PROJECT_DIR%\examples" /E /NFL /NDL /NJH /NJS >nul 2>&1
)

REM 复制文档 (可选)
set /p copy_docs="是否复制框架文档? (y/n): "
if /i "%copy_docs%"=="y" (
    mkdir "%PROJECT_DIR%\docs\metaforge" 2>nul
    robocopy "%METAFORGE_SOURCE%\docs" "%PROJECT_DIR%\docs\metaforge" /E /NFL /NDL /NJH /NJS >nul 2>&1
)

call :success "框架文件安装完成"
goto :eof

:create_project_config
call :log "创建项目配置文件..."

REM 创建.env.example文件
(
echo # MetaForge Pro 项目配置
echo METAFORGE_PROJECT_NAME=your-project-name
echo METAFORGE_VERSION=1.0
echo METAFORGE_AUTHOR=your-name
echo.
echo # 开发环境配置 ^(根据需要取消注释^)
echo # NODE_ENV=development
echo # DATABASE_URL=postgresql://localhost:5432/mydb
echo # REDIS_URL=redis://localhost:6379
echo # NEXTAUTH_SECRET=your-secret-key
echo # NEXTAUTH_URL=http://localhost:3000
echo.
echo # API Keys ^(根据需要添加^)
echo # OPENAI_API_KEY=your-openai-key
echo # GOOGLE_CLIENT_ID=your-google-client-id
echo # GOOGLE_CLIENT_SECRET=your-google-client-secret
) > "%PROJECT_DIR%\.env.example"

REM 创建基础的README.md (如果不存在)
if not exist "%PROJECT_DIR%\README.md" (
    (
    echo # %PROJECT_NAME%
    echo.
    echo ^> 使用 MetaForge Pro 框架开发的项目
    echo.
    echo ## 🚀 快速开始
    echo.
    echo ### 1. 配置环境
    echo ```bash
    echo copy .env.example .env
    echo # 编辑 .env 文件，配置你的环境变量
    echo ```
    echo.
    echo ### 2. 启动 MetaForge 协作
    echo 在 Cursor 中打开项目，然后输入：
    echo ```
    echo 开始 MetaForge 协作开发
    echo ```
    echo.
    echo ### 3. 开始开发
    echo 按照 AI 的引导，完成产品概念定义、需求规划、技术架构设计和开发实施。
    echo.
    echo ## 📁 项目结构
    echo.
    echo ```
    echo %PROJECT_NAME%/
    echo ├── .cursor/                    # MetaForge Pro 框架
    echo ├── docs/                       # 项目文档
    echo ├── src/                        # 源代码 ^(将自动创建^)
    echo ├── .env                        # 环境配置
    echo └── README.md                   # 项目说明
    echo ```
    echo.
    echo ---
    echo.
    echo *Generated by MetaForge Pro - The Ultimate AI Collaboration Framework*
    ) > "%PROJECT_DIR%\README.md"
)

REM 创建.gitignore文件 (如果不存在)
if not exist "%PROJECT_DIR%\.gitignore" (
    (
    echo # 依赖
    echo node_modules/
    echo .pnp
    echo .pnp.js
    echo.
    echo # 生产构建
    echo /build
    echo /dist
    echo /.next/
    echo /out/
    echo.
    echo # 环境变量
    echo .env
    echo .env.local
    echo .env.development.local
    echo .env.test.local
    echo .env.production.local
    echo.
    echo # 日志
    echo npm-debug.log*
    echo yarn-debug.log*
    echo yarn-error.log*
    echo.
    echo # 编辑器
    echo .vscode/
    echo .idea/
    echo *.swp
    echo *.swo
    echo.
    echo # 操作系统
    echo .DS_Store
    echo Thumbs.db
    echo.
    echo # 其他
    echo .vercel
    echo .netlify
    ) > "%PROJECT_DIR%\.gitignore"
)

call :success "项目配置文件创建完成"
goto :eof

:verify_installation
call :log "验证安装结果..."

REM 检查关键目录
set "check_dirs=.cursor .cursor\roles .cursor\templates .cursor\rules .cursor\workflows"
for %%d in (%check_dirs%) do (
    if exist "%PROJECT_DIR%\%%d" (
        call :log "✓ %%d"
    ) else (
        call :error "✗ %%d 缺失"
    )
)

REM 检查核心文件
if exist "%PROJECT_DIR%\.cursor\roles\pm-product-concept.md" (
    call :log "✓ 产品概念定义师角色"
) else (
    call :warn "✗ 产品概念定义师角色缺失"
)

if exist "%PROJECT_DIR%\.cursor\rules\metaforge-workflow.mdc" (
    call :log "✓ MetaForge 工作流引擎"
) else (
    call :warn "✗ MetaForge 工作流引擎缺失"
)

call :success "安装验证完成"
goto :eof

:show_next_steps
echo.
echo %BLUE%🎉 MetaForge Pro 安装完成！%NC%
echo.
echo %GREEN%下一步操作:%NC%
echo 1. 进入项目目录:
echo    cd "%PROJECT_DIR%"
echo.
echo 2. 配置环境变量:
echo    copy .env.example .env
echo    REM 编辑 .env 文件，设置你的配置
echo.
echo 3. 用 Cursor 打开项目:
echo    cursor .
echo.
echo 4. 在 Cursor 中开始 AI 协作:
echo    输入: '开始 MetaForge 协作开发'
echo.
echo %YELLOW%📚 学习资源:%NC%
if exist "%PROJECT_DIR%\docs\metaforge" (
    echo - 快速开始: docs\metaforge\getting-started.md
    echo - 最佳实践: docs\metaforge\best-practices.md
)
echo - 在线文档: https://docs.metaforge-pro.com
echo - 社区支持: https://community.metaforge-pro.com
echo.
echo %GREEN%祝你使用 MetaForge Pro 开发愉快! 🚀%NC%
echo.
pause
goto :eof

:cleanup
if exist "%TEMP_DIR%" (
    rmdir /s /q "%TEMP_DIR%" 2>nul
)
goto :eof