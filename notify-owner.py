#!/usr/bin/env python3
"""
Notification script for AI Token Price Comparison system

This script is called by the daily update cron job to notify the owner
when price changes or new models are detected.

Usage: python notify-owner.py [changes.json]

The changes.json file should contain an array of change objects:
[
  {
    "date": "2026-03-25",
    "type": "price_change" | "new_model",
    "provider": "aliyun" | "bytedance",
    "model": "qwen3-max",
    "level": "Flagship",
    "field": "input" | "output",
    "old": 2.0,
    "new": 2.5,
    "pctChange": 25.0
  }
]
"""

import json
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path

# Get script directory
script_dir = Path(__file__).parent

# Load changes from file or use empty array
if len(sys.argv) > 1:
    changes_file = sys.argv[1]
else:
    changes_file = script_dir / 'latest-changes.json'

changes = []

try:
    if os.path.exists(changes_file):
        with open(changes_file, 'r', encoding='utf-8') as f:
            changes = json.load(f)
        print(f'Loaded {len(changes)} changes from {changes_file}')
    else:
        print('No changes file found, skipping notification')
        sys.exit(0)
except Exception as e:
    print(f'Error loading changes: {e}')
    sys.exit(1)

if len(changes) == 0:
    print('No changes to report')
    sys.exit(0)

# Filter changes from last 7 days
today = datetime.now()
seven_days_ago = today - timedelta(days=7)
recent_changes = [c for c in changes if datetime.fromisoformat(c['date']) >= seven_days_ago]

if len(recent_changes) == 0:
    print('No recent changes (within 7 days)')
    sys.exit(0)

# Group changes by type
price_changes = [c for c in recent_changes if c['type'] == 'price_change']
new_models = [c for c in recent_changes if c['type'] == 'new_model']

# Build notification message
message = '📊 AI Token 价格变化提醒\n\n'

if price_changes:
    message += f'💰 价格变动 ({len(price_changes)} 项):\n'
    for c in price_changes[:3]:  # Show first 3
        direction = '↑' if c['pctChange'] > 0 else '↓'
        provider_name = '阿里云' if c['provider'] == 'aliyun' else '字节跳动'
        model_level = c.get('level', c['model'])
        message += f'  • {provider_name} {model_level}: ¥{c["old"]} → ¥{c["new"]} {direction}{abs(c["pctChange"]):.1f}%\n'
    
    if len(price_changes) > 3:
        message += f'  ... 还有 {len(price_changes) - 3} 项变动...\n'
    message += '\n'

if new_models:
    message += f'🎉 新模型发布 ({len(new_models)} 个):\n'
    for c in new_models:
        provider_name = '阿里云' if c['provider'] == 'aliyun' else '字节跳动'
        model_level = c.get('level', c['model'])
        message += f'  • {provider_name} {model_level}\n'
    message += '\n'

# Add footer
html_path = script_dir / 'token-price-comparison-v5.html'
message += f'详情查看：file://{html_path}\n'
beijing_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
message += f'更新时间：{beijing_time}'

print('\n=== Notification Message ===')
print(message)
print('===========================\n')

# Save to file that can be monitored
output_file = script_dir / 'pending-notification.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(message)

print(f'Notification saved to: {output_file}')
print('This file should be monitored by the QoderWork cron job system.')

# Exit with success
sys.exit(0)
