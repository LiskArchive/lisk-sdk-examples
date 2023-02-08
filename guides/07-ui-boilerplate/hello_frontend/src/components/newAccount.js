import FixedMenuLayout from '../layout/header';
import { Container, Divider } from 'semantic-ui-react';

function NewAccount() {
    return (
        <div>
            <FixedMenuLayout />
            <Container>
                <div>
                    <div class="ui green segment">
                        <i class="lightbulb outline icon"></i><strong>TIP:</strong> Reload the page to generate a new account.
                    </div>

                    <h2>New account created!</h2>
                    <Divider></Divider>
                    <div className='App'>

                    </div>
                </div>

            </Container>
        </div>
    );
}

export default NewAccount;