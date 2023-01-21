function(instance, context) {
    // set up defaults
    instance.data.input_list = null // this will be where we shove the input list
    instance.data.list_descriptor = null // this will be a string where we describe the type of list we've received from Bubble
    instance.data.status = null // this will be a string we use to describe the state of the plugin
    instance.data.initialized = null // this will be a boolean that describes whether the plugin has been initialized or not
    instance.data.input_is_list = null
    
    // why is there no default for the output list?
    // well, Bubble outputs must have a known type
    // since we don't know what will be tossed to us in the input_list, we simply can't create that
    // now do you see why we use typed inputs? 
    // ☝ READ THIS AGAIN!!!
    
    // utility function to get a list:
    instance.data.funcGetList = function getList(List) {
        var returnList = [] // set up empty list
       
        // if List is null or is not a Bubble list abort this is an error check for stupid calling on our part
        if (List != null && !List.hasOwnProperty('get')) return returnList
        
        // if the List is a List but is of zero length, we don't need to call get, so let's save some CPU cycles, shall we?
        if (List.length() < 1) return returnList
        
        // if we get here, we must need to fetch the list, so let's do that!
        return List.get(0, List.length()) // this is how we get all items in the List, of course    
        
    } // end getList
    
    // utility function to identify if any object is a Bubble List:
    instance.data.funcIsBubList = function isBubList(Object) {
        // returns true for a Bubble List object, false otherwise:
        return Object && Object.hasOwnProperty('length') && Object.hasOwnProperty('get') ? true : false
    }
    
    // utility function to tell us what sort of Items are (for example) in a List. We send it an item and it returns a string:
    instance.data.funcItemType = function itemType(Item) {
        // the Item might be null or undefined:
        if (Item === null) return 'Item is null.'
        if (Item === undefined) return 'Item is undefined.'
        // the Item might be a Thing:
        if (Item.hasOwnProperty('listProperties')) return 'Thing'
        // the Item might be a List (this is possible, but turns out it's unlikely if we're using the function properly:
        if (Item.hasOwnProperty('get')) return 'List'
 
        // If we get here, the Item must be of a basic Bubble data type, let's describe it:
        var ItemType = typeof(Item)
        
        // Note: dates are 'objects' in JavaScript, as are Bubble date ranges and numeric ranges
        return ItemType == 'object' ? 'Object (basic Bubble data type such as date or range)' : ItemType
    } // end itemType

}