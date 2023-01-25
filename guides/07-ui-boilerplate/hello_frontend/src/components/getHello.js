import FixedMenuLayout from '../layout/header';
import FixedFooter from '../layout/footer';

function GetHello() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <div>
                <h1>Get all the Hello Messages</h1>
            </div>
            <FixedFooter />
        </div>


    );
}

export default GetHello;