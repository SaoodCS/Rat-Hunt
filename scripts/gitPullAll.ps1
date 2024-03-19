git branch -r | Select-String -Pattern "->" -NotMatch | Select-String -pattern "^  origin/" | foreach { $_ -replace '^  origin/', '' } | Foreach { 
    git checkout $_
    git pull
}
