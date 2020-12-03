let dialogs = require("tns-core-modules/ui/dialogs");
let fs = require("tns-core-modules/file-system");
let labelModule = require("tns-core-modules/ui/label");
let StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
let Toast = require("nativescript-toast");
let exit = require("nativescript-exit");

function mainPageLoaded(args) {
 let page = args.object;

 // let externalDir = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();

 let todoDir = fs.knownFolders.documents();
 let editTxt = fs.path.join(todoDir.path, "todo", "edit.txt");
 let todoJson = fs.path.join(todoDir.path, "todo", "todo.json");
 let folder = todoDir.getFolder("todo");
 let file = fs.File.fromPath(todoJson);

 let layout = page.getViewById('layout');
 let label;
 let titleLabel;
 let itemId = [];
 let todo = '';
 let todoStructure = '{"todoList":[{}]}';

 var start;
 var end;
 var sla;
 var ela;

 file.readText().then((content) => {
  if (content.length > 10) {
   console.log('. ');
   console.log('. ');
   console.log('The current ToDo List in JSON:-');
   console.log(content.trim());
   console.log('. ');
   console.log('. ');
   let jsonStr = content.trim();
   try {
    todo = JSON.parse(jsonStr);
   } catch (err) {
    console.log(err.message);
   }
   for (let obj in todo) {
    for (let i = 0; i < todo[obj].length; i++) {
     let stackLayout = new StackLayout();
     titleLabel = new labelModule.Label();
     itemId.push("itemDetails" + i);
     let itemIdStr = itemId[i];
     stackLayout.id = itemIdStr;
     let todoArr = todo[obj][i];
     for (let fld in todoArr) {
      switch (fld) {
      case 'title':
       titleLabel.text = todoArr[fld];
       titleLabel.id = "todoTitle" + i;
       titleLabel.rid = itemIdStr;
       titleLabel.on('tap', (obj) => {
        let elem = '';
        for (let x in obj) {
         if (x === 'object') {
          elem = page.getViewById(obj[x].rid);
         }
        }
        if (elem.visibility === "visible") {
         elem.set("visibility", "collapsed");
        } else {
         elem.set("visibility", "visible");
        }
        page.bindingContext = elem;
       }, this);
       break;
      case 'start':
       label = new labelModule.Label(obj);
       label.className = "h3";
       label.textAlignment = "right";
       label.text = "Edit";
       label.editId = i;
       label.on('tap', (eobj) => {
        let id = '';
        let file = fs.File.fromPath(editTxt);
        for (let x in eobj) {
         if (x === 'object') {
          id = eobj[x].editId;
         }
        }
        file.writeText('"' + id + '"').then(() => {}, (error) => {
         console.log('ERROR=> ' + error);
         alert({
          title: "Error",
          message: 'Could not record the user on this local device.',
          okButtonText: "Close"
         });
        });
        let toast = Toast.makeText("Edit record => " + id);
        toast.show();
        page.frame.navigate("edit/edit");
       }, this);
       stackLayout.addChild(label);
       label = new labelModule.Label(obj);
       label.className = "h3";
       label.textAlignment = "right";
       label.text = "Delete";
       label.deleteId = i;
       label.on('tap', (eobj) => {
        dialogs.confirm({
         title: "Delete Conformation",
         message: "Are you sure?...",
         okButtonText: "Delete",
         cancelButtonText: "Cancel"
        }).then((result) => {
         if (result === true) {
          let id = '';
          let newTodo = '';
          for (let x in eobj) {
           if (x === 'object') {
            id = eobj[x].deleteId;
           }
          }
          for (let obj in todo) {
           for (let i = 0; i < todo[obj].length; i++) {
            if (i !== id) {
             let item = todo[obj][i];
             newTodo += JSON.stringify(todo[obj][i]) + ',';
            }
           }
          }
          newTodo = '{"todoList": [' + newTodo.substr(0, newTodo.length - 1) + ']}';
          file.writeText(newTodo).then(() => {
           let toast = Toast.makeText("Deleted record => " + id);
           toast.show();
           args.object.frame.navigate("list/list");
          }, (error) => {
           console.log('ERROR=> ' + error);
           alert({
            title: "Error",
            message: 'Could not record the user on this local device.',
            okButtonText: "Close"
           });
          });
         }
        });
       }, this);
       stackLayout.addChild(label);
       start = todoArr[fld];
       label = new labelModule.Label();
       label.text = 'Start:';
       sla = false;
       for (let sdt in start) {
        if (start[sdt] !== '') {
         if (sla !== true) {
          stackLayout.addChild(label);
          sla = true;
         }
         label = new labelModule.Label();
         label.text = '  ' + sdt + ': ' + start[sdt];
         stackLayout.addChild(label);
        }
       }
       break;
      case 'end':
       end = todoArr[fld];
       label = new labelModule.Label();
       label.text = 'End:';
       ela = false;
       for (let edt in end) {
        if (end[edt] !== '') {
         if (ela !== true) {
          stackLayout.addChild(label);
          ela = true;
         }
         label = new labelModule.Label();
         label.text = '  ' + edt + ': ' + end[edt];
         stackLayout.addChild(label);
        }
       }
       break;
      case 'priority':
       if (todoArr[fld] !== '') {
        label = new labelModule.Label();
        label.text = fld + ': ' + todoArr[fld];
        label.textWrap = true;
        label.id = "todoPriority" + i;
        stackLayout.addChild(label);
       }
       switch (todoArr[fld].trim()) {
       case '12':
        titleLabel.class = "highCriticalPriority";
        break;
       case '11':
        titleLabel.class = "criticalPriority";
        break;
       case '10':
        titleLabel.class = "lowCriticalPriority";
        break;
       case '9':
        titleLabel.class = "highHighPriority";
        break;
       case '8':
        titleLabel.class = "highPriority";
        break;
       case '7':
        titleLabel.class = "lowHighPriority";
        break;
       case '6':
        titleLabel.class = "highNormalPriority";
        break;
       case '5':
        titleLabel.class = "normalPriority";
        break;
       case '4':
        titleLabel.class = "lowNormalPriority";
        break;
       case '3':
        titleLabel.class = "highLowPriority";
        break;
       case '2':
        titleLabel.class = "lowPriority";
        break;
       case '1':
        titleLabel.class = "lowLowPriority";
        break;
       default:
        titleLabel.class = "noPriority";
       }
       break;
      case 'description':
       if (todoArr[fld] !== '') {
        label = new labelModule.Label();
        label.text = fld + ":- \n" + todoArr[fld] + "\n";
        label.textWrap = true;
        stackLayout.addChild(label);
       }
       break;
      case 'notes':
       if (todoArr[fld] !== '') {
        label = new labelModule.Label();
        label.text = fld + ":- \n" + todoArr[fld] + "\n";
        label.textWrap = true;
        stackLayout.addChild(label);
       }
       break;
      default:
       if (todoArr[fld] !== '') {
        label = new labelModule.Label();
        label.text = fld + ': ' + todoArr[fld];
        label.textWrap = true;
        stackLayout.addChild(label);
       }
      }
     }
     label = new labelModule.Label();
     label.text = ' ';
     stackLayout.addChild(label);
     layout.addChild(titleLabel);
     layout.addChild(stackLayout);
     label = new labelModule.Label();
     label.text = ' ';
     layout.addChild(label);
     stackLayout.set("visibility", "collapsed");
    }
   }
  } else {
   let toast = Toast.makeText("Start a new ToDo list");
   toast.show();
   let fileContent = todoStructure;
   file.writeText(fileContent).then(function () {}, function (error) {
    console.log('ERROR=> ' + error);
    alert({
     title: "Error",
     message: 'Could not record the user on this local device.',
     okButtonText: "Close"
    });
   });
  }
 }, function (error) {
  console.log(JSON.stringify(error));
 });

}

function add(args) {
 console.log("Add...");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("add/add");
}
function edit(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate("edit/edit");
}
function exitThis() {
 console.log('Buy buy...');
 Toast.makeText("Buy Buy.", "long").show();
 exit.exit();
}

exports.add = add;
exports.edit = edit;
exports.exitThis = exitThis;
exports.mainPageLoaded = mainPageLoaded;
