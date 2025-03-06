import { Component } from "react";
import React from "react";

class DynamicForm extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(): void {
        
    }

    render(): React.ReactNode {
        return( 
            <div>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" />
                </div>

                <div>
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="guest">Guest</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="subscribe">Subscribe:</label>
                    <input type="checkbox" id="subscribe" name="subscribe" />
                </div>
                
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>

            </div>
        );
    }

}