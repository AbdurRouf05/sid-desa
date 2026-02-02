# Phase 4: Deployment & Disaster Recovery

## Overview

This phase ensures the application is production-ready, resilient, and backed up.

## 1. Deployment Architecture

- **Environment**: VPS (Ubuntu/Debian).
- **Process Management**:
  - **PocketBase**: Run as a service (Systemd) or Docker container.
    - `./pocketbase serve --http=0.0.0.0:8090`
  - **Next.js**: Build and run with PM2.
    - `npm run build`
    - `pm2 start npm --name "bmt-web" -- start`
- **Reverse Proxy (Nginx)**:
  - Setup SSL (Let's Encrypt / Certbot).
  - Proxy `domain.com` -> Next.js (Port 3000).
  - Proxy `api.domain.com` -> PocketBase (Port 8090).
  - Force HTTPS.

## 2. MinIO Cleanup Strategy (Automated)

- **Script**: `pb_hooks/main.pb.js`.
- **Trigger**: `onRecordUpdate` and `onRecordDelete`.
- **Action**:
  - When image is replaced: Delete simple string match of old image path.
  - When record deleted: Loop through file fields and delete assets.
- **Cron Job (Fallback)**:
  - Weekly script to check for "Orphaned" files in MinIO (files not referenced in DB) and delete them.

## 3. Disaster Recovery (Backup)

- **Objective**: Zero data loss.
- **Strategy**:
  1. **Database**: SQLite file (`pb_data/data.db`).
  2. **Files**: MinIO Bucket.
- **Backup Script (`backup.sh`)**:
  - Stop PocketBase (briefly) or use SQLite online backup API.
  - Copy `pb_data` to a secure backup location (S3 Cold Storage or separate drive).
  - `rclone sync` MinIO bucket to a backup bucket.
- **Schedule**:
  - Run nightly (e.g., 03:00 AM) via Cron.
  - Retention: Keep last 7 days + 4 weekly backups.

## 4. Monitoring

- **Uptime**: UptimeReboot or Pingdom.
- **Logs**: Check Nginx error logs and PM2 logs regularly.
