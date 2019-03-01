import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText} from './fields'
import {required} from "./validation"

class EmailTypeForm extends Component {


    checkTemplateType(templateType){
        this.props.verifyTemplateType(templateType)
    }

    render() {
        return [
            <form key="EmailTypeForm" onSubmit={this.props.handleSubmit}>
                <div className="clearfix">
                    <div className="col-md-12">
                        <Field name="_id" component="input" className="form-control" type="hidden"></Field>
                        <Field name="name" label="Email Template Type:" component={renderText} type="text"
                               validate={[required]} onkeyup={this.checkTemplateType(this.props.templateType)}/>
                        {this.props.isEmailTemplateTypeExist ?
                           [ <h5 className="validation-error">Template Type already exist!</h5>,
                               <button type="submit" className="btn btn-submit" disabled> {(!this.props._id && "Add") || (this.props._id && "Update")}
                               </button>
                            ]:<button type="submit" className="btn customBtn"> {(!this.props._id && "Add") || (this.props._id && "Update")}
                            </button>
                        }
                    </div>
                </div>
            </form>
        ]
    }
}

EmailTypeForm = reduxForm({
    form: 'emailType'
})(EmailTypeForm)

export default EmailTypeForm
