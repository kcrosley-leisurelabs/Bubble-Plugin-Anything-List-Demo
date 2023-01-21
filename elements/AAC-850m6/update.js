function(instance, properties, context) {
    
    // update is not actually a function... so we're gonna need this variable later:
    var done = null
    
    // get the props and put them in instance
    // we will do this step-by-step and log our progress to the console!

    // read raw value from properties object:
    instance.data.input_list = properties.input_list ? properties.input_list : null
    
    console.log('ANYTHING LIST - Step 1: Reading properties.input_list. instance.data.input_list is: ', instance.data.input_list, 'typeof instance.data.input is:', typeof(instance.data.input_list))
    
    // if the input_list is null at this point, the programmer did not supply a value.
    instance.data.input_list == null ? console.log('ANYTHING LIST: input_list has not been supplied -- aborting plugin') : console.log('input_list has a value... reading...')
    
    if (!instance.data.input_list) instance.publishState('plugin_status', 'No List expression provided. Aborting plugin.')

    // NOTE: we should be able to just "return" here, but have you ever noticed that update is not actually a function?
    // It's not!
    // update is NOT a function -- it's just a code block that gets executed.
    // So, while we'd like to just jump out of here with a return statement, we cannot.
    // So we set done to true and work around that...
    // we could also just look at whether instance.data.input_list is true, but I'm making this example as explicit as possible
    
    // There's a state for whether the input is a List or not... Let's set it:
    var isList = true
    instance.publishState('input_is_list', isList)
    
    // If the input IS a list (THIS IS THE WHOLE POINT OF THIS EXERCISE), let's get that length:
    var listCount = instance.data.input_list.length()
    instance.publishState('list_length', listCount)
    
    if (!instance.data.input_list) {
        console.log('ANYTHING LIST: we should abort here... but we cannot... setting done to true') // abort - jump out of update
        done = true
    }           
                          
    // So, if we're not done, let's continue:
    
    if (!done) {
        // If we get here, instance.data.input_list has a value suppled by the Bubble programmer. Let's go get it:
        
        // ... But first, since we know this has a length, let's get that
        // THIS IS THE WHOLE POINT OF THIS EXAMPLE:
        
        console.log('ANYTHING LIST: How many items are in the list? ', instance.data.input_list.length())
        
        console.log('ANYTHING LIST Step 2: Getting values from input_list...')
        instance.data.input_list = instance.data.funcGetList(instance.data.input_list)
        
        // what did we get?
        
        // here is what instance.data.input_list is:
        var list_type = instance.data.funcItemType(instance.data.input_list)
        console.log('ANYTHING LIST: instance.data.input_list is a ', list_type)

        // here is what the first item in instance.data.input_list is:
        var description = instance.data.funcItemType(instance.data.input_list[0])
        console.log('ANYTHING LIST: instance.data.input_list has values of type: ', description)
        
        // publish the same status to the list_item_description output:
        instance.publishState('list_item_description', description)
        
        // Now, we have either a Thing or a basic data type.
        // While we can never publish either of these things as the correct type,
        // let's just go and grab these values as text and shove them to an output.
        
        // Case 1: The items are Things. In this case, we can grab the Unique IDs of the things
        // and push them to the items_as_text output. (NOTE: This is not a useful thing to do
        // we do this only for educational purposes!)
        
        // If there are Things in the list, let's grab all of those Thingss' Unique IDs (a string)
        // and shove them out to the items_as text output:
        
        if (description == 'Thing') {
            // ... but first, let's show you all of the fields on the Thing:
            var fields = instance.data.input_list[0].listProperties()
            console.log('We found a Thing and here are its fields: ', fields)
            instance.publishState('fields_on_thing', fields)
            
            // OK, now let's go get those UIDs:
            var uids = instance.data.input_list.map(item => item.get('_id'))
            console.log('Here are the unique IDs of the Thing in question:')
            instance.publishState('items_as_text', uids)
        }
        
        // if there are basic Object data types in the list, let's grab a textual representation of them and 
        // shove that out to the items_as_text output:
        
        if (description != 'Thing') {
            // please note: there's more we could do here to determine the actual
            // data types of these items, but why would I do that?
            var string_versions = instance.data.input_list.map(item => String(item))
            instance.publishState('items_as_text', string_versions)
        }
    }

    // we are really done
    console.log('ANYTHING LIST: Done with update "function".')
    instance.publishState('plugin_status', 'Update complete!')
}