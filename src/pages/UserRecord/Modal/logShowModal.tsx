import React, { useLayoutEffect, useState } from 'react';
import {Row,Col,Form} from 'antd';
import 'antd/lib/time-picker/style/index.css';
import { LogListItem } from '../data';


interface Props {
  data:LogListItem|null
}

const LogShowModal:React.FC<Props>= ((props) => {

  const [json, setJson] = useState<any>(null);
  const {data} = props;

 

  useLayoutEffect(()=>{
    setJson(data?JSON.parse(data.logParameters):{});
  },[data])

    return(
    json?
        (
          <div style={{ paddingTop: '2em' }}>
          <Form layout="vertical" >
            <Row gutter={16}>
              <Col>
              <p><strong>Güncellenen Birim : </strong>{json[0]["Value"]["Name"]}</p>
              {/* <p>{json[0]["Name"]}</p> */}
              <p>{data?.logParameters}</p>
              </Col>
            </Row>
          </Form>
        </div>
        ):(<p>Bir şeyler Ters Gitti.</p>)
      
      )
    
  });

export default LogShowModal;

