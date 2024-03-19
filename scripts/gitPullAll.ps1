# Capture the current branch:
$currentBranch = git rev-parse --abbrev-ref HEAD

git branch -r | Select-String -Pattern "->" -NotMatch | Select-String -pattern "^  origin/" | foreach { $_ -replace '^  origin/', '' } | Foreach { 
    git checkout $_
    git pull
}

# Return to the original branch:
git checkout $currentBranch
