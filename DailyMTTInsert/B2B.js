function onLoadB2B() {
    for (var i = 0; i < B2B_goals.length; i++) {
        B2BGoalsDiv.innerHTML += '<input type="checkbox" id="' + B2B_goals[i] + '" name="' + B2B_goals[i] + '">';
        B2BGoalsDiv.innerHTML += '<label for="' + B2B_goals[i]+'">' + B2B_goals[i] + '</label><br>'
    }
}

function showB2B() {
    document.getElementById("B2B").style.display = "block";
    document.getElementById("image_B2B").style.display = "block";
}

function hideB2B() {
    document.getElementById("B2B").style.display = "none";
    document.getElementById("image_B2B").style.display = "none";
}

function generateSQLB2B() {
    const postable_id = form.elements['postable_id'].value;
    const postable_type = form.elements['postable_type'].value;
    const postable_title = form.elements['postable_title'].value;
    const postable_description = form.elements['postable_description'].value;
    const postable_url = form.elements['postable_url'].value;
    const postable_image = form.elements['postable_image'].value;
    
    // Check for invalid data
    if (postable_id == '' || postable_type == '' || postable_title == '' || postable_description == '' || postable_image == '' || (postable_type.toLowerCase() == 'article' && postable_url == '')) {
        alert("Invalid input make sure all fields are filled in.");
        return;
    }

    // Insert into postables
    var insertCarWizardPostable = "INSERT INTO [homewizard_test2user].[CarWizard_Postables_Assn]([postable_type] ,[postable_title] ,[postable_description], [postable_url], [postable_image],[image_width] ,[image_height]) VALUES ('";
    insertCarWizardPostable += postable_type + "','";
    insertCarWizardPostable += postable_title + "','";
    insertCarWizardPostable += postable_description.replace(/'/g, "''") + "','";
    insertCarWizardPostable += postable_url + "','"
    insertCarWizardPostable += "/images/car-wizard-postables-assn/" + postable_image + "',1200,628)";

    SQLDiv.innerHTML += insertCarWizardPostable + "<br>";

    // Insert seasonal zone
    var seasonalZones = "INSERT INTO [homewizard_test2user].[Data_MTT_GS_Assn] ([mtt_id], [type], [gs_id]) values (" + postable_id + ",'seasonal_zone','" + form.elements['seasonal_zone_B2B'].value + "')"
    SQLDiv.innerHTML += seasonalZones + "<br>";

    // Insert goals
    for (var i = 0; i < B2B_goals.length; i++) {
        if (form.elements[B2B_goals[i]].checked) {
            var goalSQL = "INSERT INTO [homewizard_test2user].[Data_MTT_GS_Assn] ([mtt_id], [type], [gs_id]) values (" + postable_id + ",'goal','" + B2B_goals[i] + "')";
            SQLDiv.innerHTML += goalSQL + "<br>";
        }
    }
}

function clearFieldsB2B() {
    // Clear input fields
    form.elements['postable_id'].value = '';
    form.elements['postable_type'].value = '';
    form.elements['postable_title'].value = '';
    form.elements['postable_description'].value = '';
    form.elements['postable_image'].value = '';
    form.elements['postable_url'].value = '';

    // Clear Seasonal Zone
    form.elements['seasonal_zone_B2B'].value = '0';

    // Clear goals
    for (var i = 0; i < B2B_goals.length; i++) {
        form.elements[B2B_goals[i]].checked = false;
    }

    // Clear SQL Div
    SQLDiv.innerHTML = '';
}

function autoPopulateB2B() {
    clearFieldsB2B();
    navigator.clipboard.readText()
        .then(text => {
            var splittedText = text.split('\t');
            form.elements['postable_id'].value = splittedText[0];
            form.elements['postable_type'].value = splittedText[1];
            form.elements['postable_title'].value = splittedText[2];
            form.elements['postable_description'].value = splittedText[3];
            form.elements['postable_image'].value = splittedText[4];
            form.elements['postable_url'].value = splittedText[5];
            showImage();
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
}