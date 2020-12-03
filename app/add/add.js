let buttonModule = require("tns-core-modules/ui/button");
let fs = require("tns-core-modules/file-system");
let labelModule = require("tns-core-modules/ui/label");
let textFieldModule = require("tns-core-modules/ui/text-field");
let textViewModule = require("tns-core-modules/ui/text-view");
let Toast = require("nativescript-toast");
let exit = require("nativescript-exit");


function addPageLoaded(args) {

 let page = args.object;

 let todoDir = fs.knownFolders.documents();
 let editTxt = fs.path.join(todoDir.path, "todo", "edit.txt");
 let todoJson = fs.path.join(todoDir.path, "todo", "todo.json");
 let folder = todoDir.getFolder("todo");
 let file = fs.File.fromPath(editTxt);

 let button = new buttonModule.Button();
 let label = new labelModule.Label();
 let textField = new textFieldModule.TextField();
 let textView = new textViewModule.TextView();
 let layout = page.getViewById('layout');
 let todo = '';

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'Title:';
 textField.id = 'Title';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'Start Date';
 textField.id = 'StartDate';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'Start Time';
 textField.id = 'StartTime';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'End Date';
 textField.id = 'EndDate';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'End Time';
 textField.id = 'EndTime';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'Priority 1-3 Low; 4-6 med; 7-9 high; 10-12 top.';
 textField.textWrap = true;
 textField.id = 'Priority';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'State';
 textField.id = 'State';
 layout.addChild(textField);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'Description';
 textField.id = 'Description';
 layout.addChild(textField);

 textView = new textFieldModule.TextField();
 textView.class = "input input-border";
 textView.hint = 'Notes';
 textView.text = "";
 textView.id = 'Notes';
 textView.rowSpan = "10";
 textView.textWrap = true;
 layout.addChild(textView);

 textField = new textFieldModule.TextField();
 textField.class = "input input-border";
 textField.hint = 'Done';
 textField.id = 'Done';
 layout.addChild(textField);

 label = new labelModule.Label();
 label.text = ' ';
 layout.addChild(label);

 button = new buttonModule.Button();
 button.class = "btn";
 button.text = "Add ToDo item";

 button.on("tap", () => {
  let toast = Toast.makeText("Save This ToDo...");
  let _Title = page.getViewById('Title');
  let _StartDate = page.getViewById('StartDate');
  let _StartTime = page.getViewById('StartTime');
  let _EndDate = page.getViewById('EndDate');
  let _EndTime = page.getViewById('EndTime');
  let _Priority = page.getViewById('Priority');
  let _State = page.getViewById('State');
  let _Description = page.getViewById('Description');
  let _Notes = page.getViewById('Notes');
  let _Done = page.getViewById('Done');
  let jsonFragment = {
   "title": _Title.text,
   "start": {
    "date": _StartDate.text,
    "time": _StartTime.text
   },
   "end": {
    "date": _EndDate.text,
    "time": _EndTime.text
   },
   "priority": _Priority.text,
   "state": _State.text,
   "description": _Description.text,
   "notes": _Notes.text,
   "done": _Done.text
  };

  file = fs.File.fromPath(todoJson);
  file.readText().then((content) => {
   console.log({ content });
   // if (content == '{"todoList":[{}]}') {
   if(content.length > 10) {
    let jsonStr = content.trim();
    try {
     todo = JSON.parse(jsonStr);
    } catch (err) {
     console.log(err.message);
    }
    if (todo.length !== 0) {
     let todoStr = JSON.stringify(todo);
     let todoStrStart = todoStr.substr(0, todoStr.indexOf('[{') + 1);
     let todoStrEnd = todoStr.substr(todoStr.indexOf('[{') + 1, todoStr.length);
     todoStr = "";
     todoStr = todoStrStart + JSON.stringify(jsonFragment) + ',' + todoStrEnd;
     let fileContent = todoStr;
     file.writeText(fileContent).then(() => { }, (error) => {
      console.log('ERROR=> ' + error);
      alert({
       title: "Error",
       message: 'Could not record the user on this local device.',
       okButtonText: "Close"
      });
     });
    }
   } else {
    toast = Toast.makeText("Error: No JSON exists. Please try again.");
    toast.show();
   }
  }, (error) => {
   console.log(JSON.stringify(error));
  });
  setTimeout(() => {
   page.frame.navigate("list/list");
  }, 1000);
 });

 layout.addChild(button);
 label = new labelModule.Label();
 label.text = ' ';
 layout.addChild(label);

}

function home(args) {
 console.log("Home...");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("list/list");
}

function edit(args) {
 console.log("Edit...");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("edit/list");
}

function exitThis() {
 console.log('Buy buy...');
 Toast.makeText("Buy Buy.", "long").show();
 exit.exit();
}

exports.addPageLoaded = addPageLoaded;
exports.home = home;
exports.edit = edit;
exports.Exit = exitThis;
