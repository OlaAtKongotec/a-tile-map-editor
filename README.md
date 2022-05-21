# A tile map editor
### A very simple level editing web application for tile based games

I developed this little tool when I built levels for the game coneman. It's a free, online and completely open source tile map editor developed in html and javascript. Use it online or download and modify as you wish. It's a very simple program, but it does the trick for quick level editing.

There is one export that unity 3d can use directly, and thats the "Export coneman project", although it's just the level as a string inside a js-array and needs unpacking / parsing. As the editor is open source, you can also add your own level format export.

#### Quick start

To draw a level, start by clicking the "Add new level" button. If you just start it up, the coneman tile set will be available. To use your own tile set:
1. Download the tile set template (psd) - download link available at the start popup.
2. Edit / add your palette of blocks and save as png.
3. Make that file reachable over www (dropbox maybe), and paste that link when creating a new project.
4. Type block width in the new project prompt, currently the editor only supports square block.

#### Use it online
http://olapersson.com/projects/a-tile-map-editor/a-tile-map-editor.html