const qlEditor = '.ql-editor';
const issueDetails = '[data-testid="modal:issue-details"]';
const boardBacklog = '[data-testid="board-list:backlog"]';
const issueCreate = '[data-testid="modal:issue-create"]';
const listIssue = '[data-testid="list-issue"]';
const inputNumber = 'input[placeholder="Number"]';
const iconClose = '[data-testid="icon:close"]';
const iconStopwatch = '[data-testid="icon:stopwatch"]';
const modalTracking = '[data-testid="modal:tracking"]';
const inputTitle = 'input[name="title"]';
const getIssueDetailsModal = () => cy.get(issueDetails);
const reporter = '[data-testid="select:reporterId"]';
const description = 'TEST_DESCRIPTION'
const issueTitle = 'TEST_TITLE';
const messageSuccess = 'Issue has been successfully created.';
const buttonSubmit = 'button[type="submit"]';
function closeAndReOpen() {
    cy.get(iconClose).first().click();
    cy.get(boardBacklog).should('be.visible');
    cy.get(listIssue).first().click();
};

describe('Time tracking and Stopwatch', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            
            cy.get(qlEditor).type(description)
            cy.get(reporter).should('be.visible').and('contain', 'Lord Gaben');
            cy.get(inputTitle).type(issueTitle);
            cy.get(buttonSubmit).click();
            cy.get(buttonSubmit).should('not.exist');
            
            cy.get(issueCreate).should('not.exist');

            cy.contains(messageSuccess).should('be.visible');
            cy.reload();
            cy.contains(messageSuccess).should('not.exist');

            cy.get(boardBacklog).should('be.visible');
            cy.get(listIssue).first().contains(issueTitle).click();
            getIssueDetailsModal().should('be.visible');
        });
    });

    it('Adding, editing and removing time estimation', () => {
        const timeEstimated = 10;
        const timeEstimatedNew = 30;

        // No time is logged
        getIssueDetailsModal().should('contain', 'No time logged');

        // Adding estimated time 10h and making sure it is visible
        cy.get(inputNumber).type(`${timeEstimated}{enter}`);
        cy.contains(`${timeEstimated}h estimated`).should('be.visible');

        // Closing module and re-opening - making sure 10 hours is visible
        closeAndReOpen();

        getIssueDetailsModal().should('be.visible');
        cy.get(inputNumber).should('have.value', `${timeEstimated}`).and('be.visible');

        // Updating the estimation to 30h
        cy.get(inputNumber).clear().type(timeEstimatedNew);
        cy.contains(`${timeEstimatedNew}h estimated`).should('be.visible');

        // Closing and reopening updated estimation
        closeAndReOpen();

        getIssueDetailsModal().should('be.visible');
        cy.get(inputNumber).should('have.value', `${timeEstimatedNew}`).and('be.visible');

        // Removing estimated time and close the ticket
        closeAndReOpen();

        cy.get(inputNumber).clear()
        getIssueDetailsModal().should('contain', 'No time logged');
        // Waiting for the framework to update the Number value..
        cy.wait(1000);
        closeAndReOpen();

        // Checking that time is removed and have no value
        cy.get(inputNumber).should('have.value', "").and('be.visible')

    });

    it('Checking time logging functionality', () => {
        const timeSpent = 1;
        const timeRemaining = 2;

        // Fill Time spent and Time remaining
        cy.get(iconStopwatch).click();
        cy.get(modalTracking).should('be.visible');

        cy.get(inputNumber).eq(1).clear().type(timeSpent);
        cy.get(inputNumber).eq(2).clear().type(timeRemaining);

        cy.get(modalTracking).contains('Done').click();

        // Spent and Remaining time are visible
        cy.get(iconStopwatch).next().should('contain', `${timeSpent}h logged`)
            .should('not.contain', 'No time logged').and('contain', `${timeRemaining}h remaining`);

        // Re-open time tracking and remove spent and remaining time
        getIssueDetailsModal().should('be.visible');
        cy.get(iconStopwatch).click();
        cy.get(modalTracking).should('be.visible');

        cy.get(inputNumber).eq(1).clear().type('{enter}');
        cy.get(inputNumber).eq(2).clear().type('{enter}');

        cy.get(modalTracking).contains('Done').click();

        // Times are removed
        cy.get(iconStopwatch).next().should('not.contain', `${timeSpent}h logged`)
            .should('contain', 'No time logged').and('not.contain', `${timeRemaining}h remaining`);
    });
});