describe('Tests for covering issue deletion functionality', () => {
        
    const firstIssueTitle = 'This is an issue of type: Task.';
    const issueDetails = '[data-testid="modal:issue-details"]';
    const modalConfirm = '[data-testid="modal:confirm"]';
    const iconTrash = '[data-testid="icon:trash"]';

beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        //Borard contains Task issue
        cy.contains(firstIssueTitle).click();
        //Asserting that issue detail view modal is visible after clicking
        cy.get(issueDetails).should('be.visible');
        });
    })

    /* Test 1: Create a new test case for deleting issue. Do following:  
    - Add the step for opening first issue from the board already to beforeEach() block. Hint: similar solution is in the example file “issue-detail-edit.cy.js”
    - Assert, that issue detail view modal is visible. This step can be also added to beforeEach block.
    - Delete issue (click delete button and confirm deletion).
    - Assert, that deletion confirmation dialogue is not visible.
    - Assert, that issue is deleted and not displayed on the Jira board anymore. */ 

    it('Deleting an issue and confirming that it is not displayed on the Jira board anymore', () => {
        // Deleting an issue by clicking "Trash button"
        cy.get(iconTrash).click();
        // Confirming that Deletion modal is visible and confirming a deletion
        cy.get(modalConfirm).should('be.visible');
        cy.get(modalConfirm).contains('button', 'Delete issue').click()
        // Assert that deletion confirmation dialogue doesn't exist
        cy.get(modalConfirm).should('not.exist')
        // Assert that issue is deleted and not displayed on the Jira board anymore
        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
        // Assert that this list now contains 3 issues and first element with tag p hasn't specified text
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '3')
            .first()
            .find('p')
            .should('not.have.text', firstIssueTitle)
        });
    });

    /* Test 2: Create new test case for starting the deleting issue process, but cancelling this action. Do following 
    - Create new test case to the same test spec file. The same beforeEach() block will be used.
    - Assert, that issue detail view modal is visible.
    - Click delete issue button
    - Cancel the deletion in the confirmation pop-up.
    - Assert, that deletion confirmation dialogue is not visible.
    - Assert, that issue is not deleted and still displayed on the Jira board. */

    it('Starting deleting issue process but cancelling', () => {
        cy.get(iconTrash).click();
        // Confirming that Deletion modal is visible and canceling deleting
        cy.get(modalConfirm).should('be.visible')
        cy.get(modalConfirm).contains('button', 'Cancel').click();
        // Checking that Deletion modal is closed
        cy.get(modalConfirm).should('not.exist');
        // Close the Editing modal
        cy.get(issueDetails).within(() => {
            cy.get('[data-testid="icon:close"]')
            // Select first "X" button and click on it
            .first()
            .click()
        });
        // Assert that issue is NOT deleted and is still displayed on the Jira board anymore
        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
        //Assert that this list now contains 4 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '4')
            .first()
            .find('p')
            .should('have.text', firstIssueTitle)
            })
        });
});