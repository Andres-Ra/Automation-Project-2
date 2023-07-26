describe('Issue comments creating, editing and deleting', () => {
    const firstIssueTitle = 'This is an issue of type: Task.';
    const issueDetails = '[data-testid="modal:issue-details"]';
    const modalConfirm = '[data-testid="modal:confirm"]';
    const issueComment = '[data-testid="issue-comment"]';
    const addComment = 'textarea[placeholder="Add a comment..."]';
    const comment = 'TEST_COMMENT';
    const commentEdited = 'TEST_COMMENT_EDITED';
    const previousComment = 'An old silent pond...';
    const getIssueDetailsModal = () => cy.get(issueDetails);

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains(firstIssueTitle).click();
        });
    });

    it('Should create a comment successfully', () => {
        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get(addComment).type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get(issueComment).should('contain', comment);
        });
    });

    it('Should create,edit and delete comment successfully', () => {
        getIssueDetailsModal().within(() => {
            //add comment
            cy.contains('Add a comment...').click();
            cy.get(addComment).type(comment);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get(issueComment).should('contain', comment);

            //edit comment
            cy.get(issueComment).first().contains('Edit')
                .click().should('not.exist');
            cy.get(addComment)
                .should('contain', comment).clear().type(commentEdited);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.get(issueComment).should('contain', 'Edit')
                .and('contain', commentEdited);

            //delete comment
            cy.contains('Delete').click();
        });

            cy.get(modalConfirm).contains('button', 'Delete comment')
                .click().should('not.exist');
            getIssueDetailsModal().contains(commentEdited).should('not.exist');

    });

    it('Should edit a comment successfully', () => {
        getIssueDetailsModal().within(() => {
            cy.get(issueComment)
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get(addComment)
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get(issueComment)
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find(issueComment)
            .contains('Delete')
            .click();

        cy.get(modalConfirm)
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find(issueComment)
            .should('not.exist');
    });
});
