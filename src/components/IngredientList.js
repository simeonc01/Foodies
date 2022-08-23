import {useState} from "react";
import {Card, ListGroup} from "react-bootstrap";


function IngredientList(props) {
    const [ingredients] = useState(props.ingredients)

    return (
        <Card style={{width: '35rem', marginTop:"1em"}}>
            <Card.Header>Ingredienser: </Card.Header>
            <ListGroup variant="flush">
                { ingredients.map( ingredient => {
                    return <ListGroup.Item key={ingredient}> { ingredient} </ListGroup.Item>
                })}
            </ListGroup>
        </Card>
        
    )
}

export default IngredientList;