#A TILE MAP EDITOR
###A VERY SIMPLE LEVEL EDITING WEB APPLICATION FOR TILE BASED GAMES

I developed this little tool when i built levels for the game CONEMAN. It's a free, online and completely open source tile map editor developed in html and javascript. Use it online or download and modify as you wish. It's a very simple program, but it does the trick for quick level editing.

There is one export that Unity 3d can use directly, and thats the "Export CONEMAN Project", although it's just the level as a string inside a js-array and needs unpacking / parsing. As the editor is open source, you can also add your own level format export.

####QUICK START

To draw a level, start by clicking the "Add New Level" button. If you just start it up, the CONEMAN tile set will be available. To use your own tile set:
1. download the tile set template (PSD) - download link available at the start popup.
2. edit / add your palette of blocks and save as png.
3. make that file reachable over www (dropbox maybe), and paste that link when creating a new project.
4. type block width in the new project prompt, currently the editor only supports square block.