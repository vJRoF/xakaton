dotnet publish ..\src\zakupki-gov.sln -c Release --no-self-contained
docker build -t zakupki-gov ..\src\bin\Release\net5.0\publish
docker tag zakupki-gov registry.heroku.com/zakupki-gov/web
docker push registry.heroku.com/zakupki-gov/web
heroku container:release web -a zakupki-gov