# SSH Key Setup for GitHub

## 🔑 **Your SSH Public Key**

Copy the following SSH public key and add it to your GitHub account:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCdAzoMc763hu3hWI5MwQzI1ywqHpfTqaZ6XK87zue4H9p9juRNz3Z/4qusRLc1FyVynFjt7aCb4uhg0k7i2nUK9OUfCapo1wAc0kXnNsz6cRQkTOyBvJam9A3ROuExzu/MyeUQPstqN5mMXB0yPSikTStFbGeCGTb3EtNcUtdLA128zpgKJVUCR32eAeDdY+JN0N9ehLbYYfb/o4szXTl133Ff2UJ8j+Aa0YdQQAZ+9mi4yvOO3sHqpjcZKJgYQUyMBnVh/mGUEPvX1G9Dl3gi01iLq/093AGB41DUhwS2uJjPnxlYiFCpREo66C/TIu+x19a56z6kkIKcdnZv7FceqnU+dgqJkw7zZDHQnIklxkbzQ6dc2wCGgZGZid53K6KcD+ZySHAoDvIdgeqGkmwWPCztsZCd3h7Xbj7XG81ZU+lihiTy+MkXZTNqRP2HNKXLzNUP0YS1AafjTbBWkggYuMh2vnkukGD1GmELuhaAoDNIlN9dHDgwI+pUqmnCXghx5HzcKnNIcuOSzqZzLWkoItgV4DZjspMYIeVAs0zVVrFcvrKTm2OAkoa9tGW8xjUalve+M15CcssAjKKNh0p0R5Chuwwa1l65Z6HEAxGopgsSOjmvZnqWOBTCXPYgVfhJExZitSh6+ux8zbIzIch7+14HD6cqgJez1ktF79qMww== mshabeeburrahman786@gmail.com
```

## 📝 **How to Add SSH Key to GitHub**

### **Step 1: Copy the Key**
- Copy the entire SSH key above (including `ssh-rsa` at the beginning)

### **Step 2: Add to GitHub**
1. Go to [GitHub.com](https://github.com) and login
2. Click your profile picture → **Settings**
3. In left sidebar, click **SSH and GPG keys**
4. Click **New SSH key** button
5. **Title**: Enter "AR Alphaya Development Machine" 
6. **Key**: Paste the SSH key you copied
7. Click **Add SSH key**

### **Step 3: Test Connection**
Once added, test the connection with:
```bash
ssh -T git@github.com
```

You should see: `Hi haxllo! You've successfully authenticated...`

## ✅ **Benefits of SSH Key**

- **No more tokens in URLs**: Clean git commands
- **Secure authentication**: No passwords or tokens exposed  
- **Faster operations**: SSH is optimized for Git operations
- **Easy deployment**: Simple `git push` commands

## 🔧 **Current Git Configuration**

Your repository is now configured for SSH:
- **Remote URL**: `git@github.com:haxllo/ar-alphaya-jewellery.git`
- **SSH Key**: Generated and ready for GitHub
- **Key Fingerprint**: `SHA256:w8cjDqwHOPlZhzOBVoQMEvjAbz7FMBdJ88Ta/zlzPkg`

Once you add the key to GitHub, you can use normal git commands:
```bash
git push origin main
git pull origin main
```

No more need for tokens in the URL! 🎉
