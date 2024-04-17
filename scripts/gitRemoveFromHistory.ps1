# Capture an argument for the file to remove from the history:
$fileName = $args[0]

# Remove the file from the history using bfg.jar:
Write-Host "Removing $fileName from the history using bfg.jar"
java -jar bfg.jar --delete-files $fileName .git

# Push the changes to the remote repository:
Write-Host "Pushing the changes to the remote repository"
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
