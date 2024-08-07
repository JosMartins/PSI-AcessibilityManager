// reports -> array com reports do qualweb
// returns -> array (sorted) with the top 10 most common errors

/*
return example:
[
  [ 'QW-WCAG-T28', 310 ],
  [ 'QW-WCAG-T24', 36 ],
  [ 'QW-ACT-R76', 12 ],
  [ 'QW-ACT-R37', 6 ],
  [ 'QW-ACT-R11', 4 ],
  [ 'QW-ACT-R12', 2 ],
  [ 'QW-WCAG-T23', 2 ],
  [ 'QW-WCAG-T32', 2 ],
  [ 'QW-WCAG-T35', 2 ]
]

*/
function getTopFailedAssertions(reportsList) {
    let number_of_fails = {};

    for (const reports of reportsList) {

        for (const report of Object.values(reports)) {

            // Check if the report contains the 'modules' object
            if (report.modules && report.modules['act-rules'] && report.modules['wcag-techniques']) {

                const act_tests = report.modules['act-rules'].assertions;
                const wcag_tests = report.modules['wcag-techniques'].assertions;
                const combined_tests = { ...act_tests, ...wcag_tests };
                // Iterate through assertions
                for (const assertionKey in combined_tests) {
                    const assertion = combined_tests[assertionKey];

                    // Check if the assertion failed
                    if (assertion.results && assertion.results.length > 0 && assertion.metadata.outcome === 'failed') {
                        if (!number_of_fails[assertion.code]) {
                            number_of_fails[assertion.code] = 0;
                        }
                        number_of_fails[assertion.code] += assertion.metadata.failed;
                    }
                }
            }
        }
    }
    
    const dataArray = Object.entries(number_of_fails);

    // Sort the array based on the numbers (values)
    dataArray.sort((a, b) => -a[1] + b[1]);
    const top10Entries = dataArray.slice(0, 10);
    console.log(top10Entries);
    // Reconstruct the sorted array back into an object
    const sortedObject = Object.fromEntries(top10Entries);

    //console.log(sortedObject);

    // use this return if you want it in array form
    //return topEntries
    return sortedObject;
}

// report -> report generated by qualweb
// returns -> { A: 24, AA: 158, AAA: 162 }
function getFailedAssertionsByLevel(reports) {

    let number_of_fails = {};
    let fails = {
        'A': 0,
        'AA': 0,
        'AAA': 0,
    }

    for (const report of Object.values(reports)) {

        if (report.modules && report.modules['act-rules'] && report.modules['wcag-techniques']) {

            const act_tests = report.modules['act-rules'].assertions;
            const wcag_tests = report.modules['wcag-techniques'].assertions;
            const combined_tests = { ...act_tests, ...wcag_tests };

            for (const assertionKey in combined_tests) {
                const assertion = combined_tests[assertionKey];

                // Check if the assertion failed
                if (assertion.results && assertion.results.length > 0 && assertion.metadata.outcome === 'failed') {
                    if (!number_of_fails[assertion.code]) {
                        number_of_fails[assertion.code] = 0;
                    }
                    number_of_fails[assertion.code] += assertion.metadata.failed;
                    // Check if the assertion has at least one success criteria with level 'A'
                    if (assertion.metadata['success-criteria'] && assertion.metadata['success-criteria'].length > 0) {
                        const successCriteria = assertion.metadata['success-criteria']
                        // Check if the assertion has at least one success criteria with level 'A'
                        if (successCriteria.find(criteria => criteria.level === 'A')) {
                            fails['A'] += assertion.metadata.failed;
                        }

                        if (successCriteria.find(criteria => criteria.level === 'AA')) {
                            fails['AA'] += assertion.metadata.failed;
                        }

                        if (successCriteria.find(criteria => criteria.level === 'AAA')) {
                            fails['AAA'] += assertion.metadata.failed;
                        }
                    }
                }
            }
        }
    }
    return fails;
}

async function testEvaluatePage() {
    let reports = []
    try {
        const url = 'https://google.com'; // URL to evaluate
        const report = await evaluatePage(url); // Call the function with the URL

        // Print the result
        //console.log('Evaluation Report:', report[url]);
        console.log(getFailedAssertionsByLevel(report[url]));
        reports.push(report[url]);
        getTopFailedAssertions(reports);

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Call the test function
//testEvaluatePage();

module.exports = { getFailedAssertionsByLevel, getTopFailedAssertions }