let buttonModule = require("tns-core-modules/ui/button");
let fs = require("tns-core-modules/file-system");
let labelModule = require("tns-core-modules/ui/label");
let textFieldModule = require("tns-core-modules/ui/text-field");
let textViewModule = require("tns-core-modules/ui/text-view");
let Toast = require("nativescript-toast");
let exit = require("nativescript-exit");


function editPageLoaded(args) {
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
 let recordNo = '';
 let todo = '';
 file.readText().then((t) => {
  recordNo = t.trim();
  recordNo = parseInt(recordNo.substr(1, recordNo.length - 2));
  file = fs.File.fromPath(todoJson);
  file.readText().then((content) => {
   if (content.length > 10) {
    let jsonStr = content.trim();
    try {
     todo = JSON.parse(jsonStr);
    } catch (err) {
     console.log(err.message);
    }
    for (let obj in todo) {
     for (let i = 0; i < todo[obj].length; i++) {
      if (i === recordNo) {
       for (let obj0 in todo[obj][i]) {
        switch (obj0) {
        case 'start':
         for (let obj1 in todo[obj][i][obj0]) {
          switch (obj1) {
          case 'date':
           textField = new textFieldModule.TextField();
           textField.class = "input input-border";
           textField.hint = [obj1];
           textField.text = todo[obj][i][obj0][obj1];
           textField.id = '_' + obj0 + obj1;
           layout.addChild(textField);
           break;
          case 'time':
           textField = new textFieldModule.TextField();
           textField.class = "input input-border";
           textField.hint = [obj1];
           textField.text = todo[obj][i][obj0][obj1];
           textField.id = '_' + obj0 + obj1;
           layout.addChild(textField);
           break;
          }
         }
         break;
        case 'end':
         for (let obj1 in todo[obj][i][obj0]) {
          switch (obj1) {
          case 'date':
           textField = new textFieldModule.TextField();
           textField.class = "input input-border";
           textField.hint = [obj1];
           textField.text = todo[obj][i][obj0][obj1];
           textField.id = '_' + obj0 + obj1;
           layout.addChild(textField);
           break;
          case 'time':
           textField = new textFieldModule.TextField();
           textField.class = "input input-border";
           textField.hint = [obj1];
           textField.text = todo[obj][i][obj0][obj1];
           textField.id = '_' + obj0 + obj1;
           layout.addChild(textField);
           break;
          }
         }
         break;
        case 'priority':
         textField = new textFieldModule.TextField();
         textField.class = "input input-border";
         textField.hint = 'Priority 1-3 Low; 4-6 med; 7-9 high; 10-12 top.';
         textField.textWrap = true;
         textField.text = todo[obj][i][obj0];
         textField.id = '_' + [obj0];
         layout.addChild(textField);
         break;
        case 'notes':
         textView = new textViewModule.TextView();
         textView.class = "input input-border";
         textView.hint = [obj0];
         textView.text = todo[obj][i][obj0];
         textView.id = '_' + [obj0];
         textView.rowSpan = "10";
         textView.textWrap = true;
         layout.addChild(textView);
         break;
        default:
         textField = new textFieldModule.TextField();
         textField.class = "input input-border";
         textField.hint = [obj0];
         textField.text = todo[obj][i][obj0];
         textField.id = '_' + [obj0];
         layout.addChild(textField);
        }
        label = new labelModule.Label();
        label.text = ' ';
        layout.addChild(label);
       }
      }
     }
    }
   }
  });
 });
 setTimeout(() => {
  button = new buttonModule.Button();
  button.class = "btn";
  button.text = "Update ToDo item";
  button.on("tap", () => {
   let toast = Toast.makeText("Save This ToDo...");
   let _Title = page.getViewById('_title');
   let _StartDate = page.getViewById('_startdate');
   let _StartTime = page.getViewById('_starttime');
   let _EndDate = page.getViewById('_enddate');
   let _EndTime = page.getViewById('_endtime');
   let _Priority = page.getViewById('_priority');
   let _State = page.getViewById('_state');
   let _Description = page.getViewById('_description');
   let _Notes = page.getViewById('_notes');
   let _Done = page.getViewById('_done');
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
   for (let obj in todo) {
    for (let i = 0; i < todo[obj].length; i++) {
     if (i === recordNo) {
      todo[obj][i] = jsonFragment;
     }
    }
   }
   let fileContent = JSON.stringify(todo);
   file.writeText(fileContent).then(() => {
    Toast.makeText("Save This ToDo...").toast.show();
    page.frame.navigate("list/list");
   }, (error) => {
    console.log('ERROR=> ' + error);
    alert({
     title: "Error",
     message: 'Could not record the user on this local device.',
     okButtonText: "Close"
    });
   });
   file = fs.File.fromPath(todoJson);
   file.writeText(fileContent).then(() => {}, (error) => {
    console.log('ERROR=> ' + error);
    alert({
     title: "Error",
     message: 'Could not record the user on this local device.',
     okButtonText: "Close"
    });
   });
  });

  layout.addChild(button);
 }, 1000);

}


function home(args) {
 console.log("Home...");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("list/list");
}

function add(args) {
 console.log("Add....");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("add/add");
}

function exitThis () {
 console.log('Buy buy...');
 Toast.makeText("Buy Buy.", "long").show();
 exit.exit();
}

exports.home = home;
exports.add = add;
exports.exitThis = exitThis;
exports.editPageLoaded = editPageLoaded;
