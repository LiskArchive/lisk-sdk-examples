import React from 'react'
import {
    Container,
    Divider,
    List,
    Segment,
} from 'semantic-ui-react'

const FixedFooter = () => (
    <div>
        <Segment FixedFooter inverted vertical style={{ margin: 0, position: 'absolute', bottom: 0, width: '100%', overflow: 'hidden' }}>
            <Container textAlign='center'>
                <List horizontal inverted divided link size='med'>
                    <List.Item as='a' href='#'>
                        Copyright @ 2023
                    </List.Item>
                </List>
            </Container>
        </Segment>
    </div >
)

export default FixedFooter