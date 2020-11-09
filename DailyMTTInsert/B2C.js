function onLoadB2C() {
    for (var i = 0; i < goals.length; i++) {
        goalsDiv.innerHTML += '<input type="checkbox" id="' + goals[i] + '" name="' + goals[i] + '">';
        goalsDiv.innerHTML += '<label for="' + goals[i]+'">' + goals[i] + '</label><br>'
    }
    for (var i = 0; i < situations.length; i++) {
        situationsDiv.innerHTML += '<input type="checkbox" id="' + situations[i] + '" name="' + situations[i] + '">';
        situationsDiv.innerHTML += '<label for="' + situations[i]+'">' + situations[i] + '</label><br>'
    }
    for (var i = 0; i < businesses.length; i++) {
        businessesDiv.innerHTML += '<input type="checkbox" id="' + businesses[i] + '" name="' + businesses[i] + '">';
        businessesDiv.innerHTML += '<label for="' + businesses[i]+'">' + businesses[i] + ', ' + '</label>';
        businessesDiv.innerHTML += '<input type="checkbox" id="' + businesses[i] + '-not-if' + '" name="' + businesses[i] + '-not-if' + '">';
        businessesDiv.innerHTML += '<label for="' + businesses[i] + '-not-if'+'">' + 'not-if' + '</label><br>';
    }
}

function showB2C() {
    document.getElementById("B2C").style.display = "block";
    document.getElementById("image").style.display = "block";
}

function hideB2C() {
    document.getElementById("B2C").style.display = "none";
    document.getElementById("image").style.display = "none";
}

function generateSQLB2C() {
    const dayOfYear = form.elements['dayOfYear'].value;
    const title = form.elements['title'].value;
    const description = form.elements['description'].value;
    const imgFileName = form.elements['imgFileName'].value;

    // Check for invalid data
    if (dayOfYear == '' || title == '' || description == '' || imgFileName == '') {
        alert("Invalid input make sure all fields are filled in.");
        return;
    }

    // Check if a business was selected for business and not-if
    for (var i = 0; i < businesses.length; i++) {
        if (form.elements[businesses[i]].checked && form.elements[businesses[i] + '-not-if'].checked) {
            alert("Business selected for both type = business and type = not-if. Cannot be both.");
            return;
        }
    }
    
    // Postables from DB Query string
    var insertCarWizardPostable = "INSERT INTO [homewizard_test2user].[CarWizard_Postables]([dayofyear],[image] ,[title] ,[description],[image_width] ,[image_height]) VALUES (";
    insertCarWizardPostable += dayOfYear + ",'";
    insertCarWizardPostable += "/images/car-wizard-postables/" + imgFileName + "','";
    insertCarWizardPostable += title + "','";
    insertCarWizardPostable += description.replace(/'/g, "''") + "',1200,628)";

    SQLDiv.innerHTML += insertCarWizardPostable + "<br>";

    // GS Seasonal Zones
    var seasonalZones = "INSERT INTO [homewizard_test2user].[Data_MTT_GS] ([mtt_id], [type], [gs_id]) values (" + dayOfYear + ",'seasonal_zone','" + form.elements['seasonal_zone'].value + "')"
    SQLDiv.innerHTML += seasonalZones + "<br>";

    // GS Businesses
    for (var i = 0; i < businesses.length; i++) {
        if (form.elements[businesses[i]].checked) {
            var businessSQL = "INSERT INTO [homewizard_test2user].[Data_MTT_GS] ([mtt_id], [type], [gs_id]) values (" + dayOfYear + ",'business','" + businesses[i] + "')";
            SQLDiv.innerHTML += businessSQL + "<br>";
        }
        if (form.elements[businesses[i] + '-not-if'].checked) {
            var businessSQL = "INSERT INTO [homewizard_test2user].[Data_MTT_GS] ([mtt_id], [type], [gs_id]) values (" + dayOfYear + ",'not-if','" + businesses[i] + "')";
            SQLDiv.innerHTML += businessSQL + "<br>";
        }
    }
    // GS Goals
    for (var i = 0; i < goals.length; i++) {
        if (form.elements[goals[i]].checked) {
            var goalSQL = "INSERT INTO [homewizard_test2user].[Data_MTT_GS] ([mtt_id], [type], [gs_id]) values (" + dayOfYear + ",'goal','" + goals[i] + "')";
            SQLDiv.innerHTML += goalSQL + "<br>";
        }
    }
    // GS Situations
    for (var i = 0; i < situations.length; i++) {
        if (form.elements[situations[i]].checked) {
            var situationSQL = "INSERT INTO [homewizard_test2user].[Data_MTT_GS] ([mtt_id], [type], [gs_id]) values (" + dayOfYear + ",'situation','" + situations[i] + "')";
            SQLDiv.innerHTML += situationSQL + "<br>";
        }
    }
}

function clearFieldsB2C() {
    // Clear the Input fields
    form.elements['dayOfYear'].value = '';
    form.elements['title'].value = '';
    form.elements['description'].value = '';
    form.elements['imgFileName'].value = '';

    // Clear Seasonal Zone
    form.elements['seasonal_zone'].value = '0';

    // Clear goals
    for (var i = 0; i < goals.length; i++) {
        form.elements[goals[i]].checked = false;
    }
    // Clear situations
    for (var i = 0; i < situations.length; i++) {
        form.elements[situations[i]].checked = false;
    }
    // Clear businesses
    for (var i = 0; i < businesses.length; i++) {
        form.elements[businesses[i]].checked = false;
        form.elements[businesses[i] + '-not-if'].checked = false;
    }

    // Clear SQL Div
    SQLDiv.innerHTML = '';
}

function autoPopulateB2C() {
    clearFieldsB2C();
    navigator.clipboard.readText()
        .then(text => {
            var splittedText = text.split('\t');
            form.elements['dayOfYear'].value = splittedText[0];
            form.elements['title'].value = splittedText[1];
            form.elements['description'].value = splittedText[2];
            form.elements['imgFileName'].value = splittedText[3];
            showImage();
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
}