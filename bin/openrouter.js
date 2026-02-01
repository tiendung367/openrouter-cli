#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { runCLI } from '../src/index.js';
import { isLoggedIn, loginWithCode, logout, getUsername, loadConfig } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0];

// Handle commands
async function main() {
  switch (command) {
    case 'login':
      await handleLogin();
      break;

    case 'logout':
      handleLogout();
      break;

    case 'status':
      handleStatus();
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    case 'chat':
    default:
      await startChat();
      break;
  }
}

async function handleLogin() {
  console.log(chalk.cyan('\n🔗 Đăng nhập OpenRouter CLI\n'));

  if (isLoggedIn()) {
    console.log(chalk.yellow(`Bạn đã đăng nhập với tài khoản: ${chalk.bold(getUsername())}`));
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Bạn muốn đăng nhập lại?',
      default: false
    }]);
    if (!confirm) {
      console.log(chalk.gray('Hủy đăng nhập.'));
      return;
    }
  }

  console.log(chalk.gray('1. Truy cập website và đăng nhập'));
  console.log(chalk.gray('2. Vào Dashboard → Nhấn "Lấy mã kích hoạt"'));
  console.log(chalk.gray('3. Nhập mã 8 ký tự bên dưới\n'));

  const { code } = await inquirer.prompt([{
    type: 'input',
    name: 'code',
    message: 'Nhập mã kích hoạt:',
    validate: input => input.length >= 6 || 'Mã phải có ít nhất 6 ký tự'
  }]);

  try {
    console.log(chalk.gray('\nĐang xác thực...'));
    const result = await loginWithCode(code);
    console.log(chalk.green(`\n✅ ${result.message}`));
    console.log(chalk.cyan(`\nBắt đầu chat: ${chalk.bold('openrouter chat')}`));
  } catch (error) {
    console.log(chalk.red(`\n❌ ${error.message}`));
  }
}

function handleLogout() {
  if (!isLoggedIn()) {
    console.log(chalk.yellow('Bạn chưa đăng nhập.'));
    return;
  }

  logout();
  console.log(chalk.green('✅ Đã đăng xuất thành công.'));
}

function handleStatus() {
  console.log(chalk.cyan('\n📊 Trạng thái OpenRouter CLI\n'));

  if (isLoggedIn()) {
    const config = loadConfig();
    console.log(chalk.green('● Đã đăng nhập'));
    console.log(`  Username: ${chalk.bold(config.username)}`);
    console.log(`  Đăng nhập lúc: ${chalk.gray(config.loggedInAt)}`);
    console.log(`  API Key: ${chalk.gray(config.apiKey?.slice(0, 20) + '...')}`);
  } else {
    console.log(chalk.yellow('○ Chưa đăng nhập'));
    console.log(chalk.gray('\nĐăng nhập: openrouter login'));
  }
  console.log();
}

function showHelp() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════╗
║        🚀 OpenRouter CLI v1.0.0          ║
╚══════════════════════════════════════════╝
`));
  console.log(chalk.bold('Cách sử dụng:'));
  console.log('  openrouter [command]\n');

  console.log(chalk.bold('Commands:'));
  console.log('  login     Đăng nhập bằng mã từ website');
  console.log('  logout    Đăng xuất');
  console.log('  status    Xem trạng thái đăng nhập');
  console.log('  chat      Bắt đầu chat (mặc định)');
  console.log('  help      Hiển thị trợ giúp\n');

  console.log(chalk.bold('Ví dụ:'));
  console.log('  openrouter login');
  console.log('  openrouter chat');
  console.log('  openrouter status\n');
}

async function startChat() {
  // Check login status - MUST LOGIN TO USE
  if (!isLoggedIn()) {
    console.log(chalk.yellow('\n⚠️  Bạn chưa đăng nhập.\n'));
    console.log(chalk.gray('Để sử dụng CLI, bạn cần đăng nhập trước:'));
    console.log(chalk.cyan('\n  1. Truy cập website và đăng ký/đăng nhập'));
    console.log(chalk.cyan('  2. Vào Dashboard → Lấy mã kích hoạt'));
    console.log(chalk.cyan('  3. Chạy: openrouter login\n'));

    const { login } = await inquirer.prompt([{
      type: 'confirm',
      name: 'login',
      message: 'Đăng nhập ngay?',
      default: true
    }]);

    if (login) {
      await handleLogin();
    } else {
      console.log(chalk.gray('\n👋 Hẹn gặp lại!'));
    }
    return;
  }

  console.log(chalk.green(`\n👋 Xin chào, ${chalk.bold(getUsername())}!\n`));

  // Run main CLI
  await runCLI();
}

main().catch(err => {
  console.error(chalk.red('FATAL ERROR:'), err);
  process.exit(1);
});
