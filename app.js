var budgetController = (function () {
    
    var Expense = function (id,description,value){
        
        this.id=id;
        this.description=description;
        this.value = value;
        this.percent = -1 ;
    }
    
    Expense.prototype.calcPercentage = function (totalIncome){
        
        if(totalIncome>0){
        this.percent = Math.round((this.value/totalIncome)*100);
        
        }else {
            
            
            this.percent = -1;
        }
        
    }
    
    Expense.prototype.getPercentage = function(){
        
        
        return this.percent;
        
        
    }
 
    
    
     var Income = function (id,description,value){
        
        this.id=id;
        this.description=description;
        this.value = value;
    }
     
     var  calculateTotal = function(type){
             
             //Add all incomes and expenses
             var sum=0;
             
             data.allItems[type].forEach( function(curr){
                 
                 sum+= curr.value;
                 
                 });
             
             //calculate total exp or inc
             data.totals[type] = sum;
             
            
         };
     
     var data = {
         allItems : {
             
             exp :[],
             inc :[]
             
                    },
         
         totals : {
             
             exp :0,
             inc :0
         },
         budget :0,
         percentage :-1
     }
 
     
     return {
         
         addItem : function (type,desc,amount){
             
             var newItem, ID;
             
             if(data.allItems[type].length > 0){
             
             ID = data.allItems[type][data.allItems[type].length -1].id +1 ;
             } else {
                 
                 ID =0;
             }
             
             if (type== 'exp'){
                 
                newItem =  new Expense(ID,desc,amount);
             }else if(type == 'inc'){
                 
                newItem = new Income(ID,desc,amount)
             }
             
             data.allItems[type].push(newItem);
             return newItem ; 
             

         },
         
         deleteItem : function (type, id){
             
             var idArray, indexToDelete;
             
             idArray = data.allItems[type].map(function (current){
                 
                 
                return current.id; 
                 
                 
             });
             
            
             indexToDelete = idArray.indexOf(id);
             
              if (indexToDelete !== -1){
             data.allItems[type].splice(indexToDelete, 1);
                  
                  
              }
             
         },
         
       
         
         calculateBudget : function(){
             
            
             calculateTotal ('inc');
             calculateTotal('exp');
             
             //calculate budget
             data.budget = data.totals.inc - data.totals.exp;
             
             //calculate percentage
             if(data.totals.inc >0){
             data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
             } else data.percentage = -1 ;
             
             
         },
         
         calculatePercentages : function(){
             
             
             data.allItems.exp.forEach(function(cur){
                 
                 
                 cur.calcPercentage(data.totals.inc);
                 
             });
             
             
         },
         
         getPercentages : function (){
             
             
             var allpercentages = data.allItems.exp.map(function(cur){
                 
                 return cur.getPercentage();
                 
             });
             
             return allpercentages;
             
         },
         
         getBudget : function (){
             
             return {
                 
                 budget : data.budget,
                 percentage : data.percentage,
                 totalIncome : data.totals.inc,
                 totalExpense : data.totals.exp
                 
                 
             }
             
         },
         
         testing : function (){
             
             
             console.log(data);
         } 
     }
    
}) ();



var uiController = (function (){
    
    var DOMStrings = {
        
        type : '.add__type',
        desc : '.add__description',
        amnt : '.add__value',
        btn  : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budget : '.budget__value' ,
        incomeTotal : '.budget__income--value',
        expenseTotal : '.budget__expenses--value',
        expensepercent : '.budget__expenses--percentage',
        container : '.container',
        expListItemPercent : '.item__percentage',
        dateLabel : '.budget__title--month'
        
        }
    
    
     var  formatNumbers = function(num, type){
            var numSplit, int,dec ;
            
            // + or - before number depending on type, thousnads seaparated by coma, 2 decimal points
            
            
            num = Math.abs(num);
            num= num.toFixed(2);
            
             numSplit = num.split('.');
             int = numSplit[0];
             dec= numSplit[1];
            //comma separator
            
            if (int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3 , 3);
                
            }
            
            return (type == 'exp' ? '-' : '+') + ' ' + int + '.' + dec ;
            
        };
    
       var nodeListForEach = function(list, callback){
                for (var i = 0; i< list.length ; i++){
                    
                    callback(list[i] , i);
                    
                }
                
                
                
                
            };
       
    return {
        
        getInputData: function(){
            
            return{ 
                
                inputType : document.querySelector(DOMStrings.type).value, //INC OR EXP
                description : document.querySelector(DOMStrings.desc).value,
                amount : parseFloat(document.querySelector(DOMStrings.amnt).value)
                   
                  }
        },
        
        getDOMStrings : function(){
            
            return DOMStrings;
            
        },
        
        addListItem : function (obj, type){
              var html, newhtml,element;  
            //create html string for placeholder
            if (type == 'inc'){
                
                element = DOMStrings.incomeContainer;
                html=  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>' ;
                
                
            }else if (type == 'exp'){
                element = DOMStrings.expenseContainer;
                
                html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
                
                
                
            }
            
            //replace html string with data
            
            newhtml = html.replace('%id%' , obj.id);
            newhtml = newhtml.replace('%description%' , obj.description);
            newhtml = newhtml.replace('%value%', formatNumbers(obj.value , type));
            
            //update UI with html string
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
          
        },
        
        deleteListItem : function (selectorID){
            
            var el = document.getElementById(selectorID);
            //console.log(el.parentNode);
            //console.log('Entered delete function');
           // console.log(el);
           // console.log(el.parentNode);
            //el.innerHTML='';
           // el.parentNode.innerHTML='';
            el.parentNode.removeChild(el);
            
            
        },
        
        
        displayBudget : function (obj){
           
            var type;
            obj.budget >0 ? type = 'inc' : type = 'exp' ;
            
            document.querySelector(DOMStrings.budget).textContent = formatNumbers(obj.budget , type);
            document.querySelector(DOMStrings.incomeTotal).textContent = formatNumbers(obj.totalIncome, 'inc');
            document.querySelector(DOMStrings.expenseTotal).textContent = formatNumbers(obj.totalExpense , 'exp');
            document.querySelector(DOMStrings.expensepercent).textContent = obj.percentage;
            
            if (obj.percentage > 0){
                
                document.querySelector(DOMStrings.expensepercent).textContent = obj.percentage + '%';
            }else document.querySelector(DOMStrings.expensepercent).textContent = '---' ;
        },
        
        displayPercentages : function(percentages){
            
            
            var fields = document.querySelectorAll(DOMStrings.expListItemPercent);
            //console.log(fields);
            
         
            
            
            nodeListForEach(fields, function(cur, index){
                
                cur.textContent =  percentages[index];
                
                
                
            });
            
            
            
        },
        
        displayDate : function(){
            
            
            var now, year, month, monthArray;
            
            monthArray = ['Jnauary', 'February', 'March', 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December'];
            
            now = new Date();
            
            year = now.getFullYear();
            
            month = now.getMonth();
            
            document.querySelector(DOMStrings.dateLabel).textContent = monthArray[month] + ' ' + year;
            
            
        },
        
        
        changedType : function (){
            
            var fields = document.querySelectorAll(DOMStrings.type + ',' +DOMStrings.desc + ',' + DOMStrings.amnt);
            
            nodeListForEach(fields , function(cur){
                
                cur.classList.toggle('red-focus');
                
                
            });
            
            document.querySelector(DOMStrings.btn).classList.toggle('red');
        },
     
        
        
        clearFields : function (){
            
            var fields, fieldsArray;
            
            fields = document.querySelectorAll(DOMStrings.desc +','+ DOMStrings.amnt);
           // console.log("fields after queryselectorall");
            //console.log(fields[0].value);
            fieldsArray = Array.prototype.slice.call(fields);
           // console.log("fields after slicecall before emptying values");
            //console.log(fieldsArray[0].value);
            fieldsArray.forEach(function(current,index,array){
                
                
                current.value = '';
                
                
            });
            
            fieldsArray[0].focus();
            
        }
    }
    
})();




var appController = (function(bController,uController){
    
    
    var DOM = uiController.getDOMStrings();
    var setupEventListeners = function (){
        
           document.querySelector(DOM.btn).addEventListener('click', cntrlAddItem);
    
           document.addEventListener('keypress', function(event){
        
        if (event.keyCode === 13 || event.which === 13) {
        cntrlAddItem();
        
                                                         }
        
        
   });
        
          document.querySelector(DOM.container).addEventListener('click', cntrlDeleteItem);
        
        document.querySelector(DOM.type).addEventListener('change' , uController.changedType);
      
                                        };
    
      
        var updateBudget = function (){
            
            //calculate budget
            bController.calculateBudget();
            
            //return budget
            var budget = bController.getBudget();
            
            //display budget
            uController.displayBudget(budget);
            
        };
    
    var updatePercentages = function (){
        var percentArray;
        
        //calculate percentages
        
        bController.calculatePercentages();
        
        //get all percentages
        percentArray=bController.getPercentages();
        
        //update UI with percentage
       uiController.displayPercentages(percentArray);
        
    };
    
    
    var cntrlAddItem = function (){
        
        var inputData,newItem;
         inputData = uiController.getInputData();
        
        if (inputData.description !== '' && !isNaN(inputData.amount) && inputData.amount!== 0){
         newItem = bController.addItem(inputData.inputType,inputData.description,inputData.amount);
        // console.log(newItem);
         uController.addListItem (newItem, inputData.inputType);
        uController.clearFields();
        
        //code
            
           
        }
        
        updateBudget();  
        
        updatePercentages();
    }
    
    var cntrlDeleteItem = function (event){
        
        var itemID,splitTypeID,type,ID;
       // console.log(event.target);
       // console.log(event.target.parentNode.parentNode.parentNode.parentNode);//same as document.getElementById(selectorID) in deleteListItem function
        
        console.log(event.target);
        console.log(event.target.parentNode.parentNode.parentNode.parentNode);
        console.log(event.target.parentElement.parentElement.parentElement.parentElement);
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
       
        if (itemID){
        splitTypeID = itemID.split('-');
        
          type = splitTypeID[0];
          ID = parseInt(splitTypeID[1]);  
            
        //delete from datastructure
            bController.deleteItem(type , ID);
            
            //delete from UI
        uController.deleteListItem(itemID);
                                   
                                   }
        
        
        //update budget
        updateBudget();
        
        //update percentages
        
        updatePercentages();
    };
                                   
                                   
    
    
  return {
      
      init : function(){
          
          console.log("Application has started");
          
          uController.displayDate();
          uController.displayBudget({
              
               budget : 0,
                 percentage : 0,
                 totalIncome : 0,
                 totalExpense : 0
              
              
          });
          setupEventListeners();
      }
      
      
  }
    
    
})(budgetController,uiController);



//Call init from outside

appController.init();
