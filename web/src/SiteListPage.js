// Copyright 2023 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Link} from "react-router-dom";
import {Button, Col, Popconfirm, Row, Table, Tag} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import moment from "moment";
import * as Setting from "./Setting";
import * as SiteBackend from "./backend/SiteBackend";
import i18next from "i18next";

class SiteListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sites: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getSites();
  }

  getSites() {
    SiteBackend.getSites(this.props.account.name)
      .then((res) => {
        this.setState({
          sites: res,
        });
      });
  }

  newSite() {
    const randomName = Setting.getRandomName();
    return {
      owner: this.props.account.name,
      name: `site_${randomName}`,
      createdTime: moment().format(),
      displayName: `New Site - ${randomName}`,
      domain: "door.casdoor.com",
      host: "http://localhost:8000",
      sslMode: "HTTP",
      sslCert: "",
    };
  }

  addSite() {
    const newSite = this.newSite();
    SiteBackend.addSite(newSite)
      .then((res) => {
        Setting.showMessage("success", "Site added successfully");
        this.setState({
          sites: Setting.prependRow(this.state.sites, newSite),
        });
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Site failed to add: ${error}`);
      });
  }

  deleteSite(i) {
    SiteBackend.deleteSite(this.state.sites[i])
      .then((res) => {
        Setting.showMessage("success", "Site deleted successfully");
        this.setState({
          sites: Setting.deleteRow(this.state.sites, i),
        });
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Site failed to delete: ${error}`);
      });
  }

  renderTable(sites) {
    const renderExternalLink = () => {
      return (
        <svg style={{marginLeft: "5px"}} width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" className="iconExternalLink_nPIU">
          <path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path>
        </svg>
      );
    };

    const columns = [
      {
        title: i18next.t("general:Name"),
        dataIndex: "name",
        key: "name",
        width: "120px",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/sites/${text}`}>
              {text}
            </Link>
          );
        },
      },
      // {
      //   title: i18next.t("general:Create time"),
      //   dataIndex: "createdTime",
      //   key: "createdTime",
      //   width: "180px",
      //   sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
      //   render: (text, record, index) => {
      //     return Setting.getFormattedDate(text);
      //   },
      // },
      {
        title: i18next.t("general:Display name"),
        dataIndex: "displayName",
        key: "displayName",
        // width: "200px",
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
      },
      {
        title: i18next.t("site:Domain"),
        dataIndex: "domain",
        key: "domain",
        width: "150px",
        sorter: (a, b) => a.domain.localeCompare(b.domain),
        render: (text, record, index) => {
          if (record.publicIp === "") {
            return text;
          }

          return (
            <a target="_blank" rel="noreferrer" href={`https://${text}`}>
              {text}
            </a>
          );
        },
      },
      {
        title: i18next.t("site:Host"),
        dataIndex: "host",
        key: "host",
        width: "180px",
        sorter: (a, b) => a.host.localeCompare(b.host),
        render: (text, record, index) => {
          if (!record.isSelf) {
            return text;
          }

          return (
            <a target="_blank" rel="noreferrer" href={text}>
              {text}
            </a>
          );
        },
      },
      {
        title: i18next.t("site:Public IP"),
        dataIndex: "publicIp",
        key: "publicIp",
        width: "120px",
        sorter: (a, b) => a.publicIp.localeCompare(b.publicIp),
      },
      {
        title: i18next.t("site:Node"),
        dataIndex: "node",
        key: "node",
        width: "180px",
        sorter: (a, b) => a.node.localeCompare(b.node),
        render: (text, record, index) => {
          return (
            <div>
              {text}
              {
                !record.isSelf ? null : (
                  <Tag style={{marginLeft: "10px"}} icon={<CheckCircleOutlined />} color="success">
                    {i18next.t("general:Self")}
                  </Tag>
                )
              }
            </div>
          );
        },
      },
      {
        title: i18next.t("site:SSL mode"),
        dataIndex: "sslMode",
        key: "sslMode",
        width: "120px",
        sorter: (a, b) => a.sslMode.localeCompare(b.sslMode),
      },
      {
        title: i18next.t("site:SSL cert"),
        dataIndex: "sslCert",
        key: "sslCert",
        width: "150px",
        sorter: (a, b) => a.sslCert.localeCompare(b.sslCert),
        render: (text, record, index) => {
          return (
            <Link to={`/certs/${text}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: i18next.t("site:Casdoor app"),
        dataIndex: "casdoorApplication",
        key: "casdoorApplication",
        width: "150px",
        sorter: (a, b) => a.casdoorApplication.localeCompare(b.casdoorApplication),
        render: (text, record, index) => {
          if (text === "") {
            return null;
          }

          return (
            <a target="_blank" rel="noreferrer" href={Setting.getMyProfileUrl(this.state.account).replace("/account", `/applications/${this.props.account.owner}/${text}`)}>
              {text}
              {renderExternalLink()}
            </a>
          );
        },
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: "action",
        key: "action",
        width: "180px",
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/sites/${record.name}`)}>{i18next.t("general:Edit")}</Button>
              <Popconfirm
                title={`Sure to delete site: ${record.name} ?`}
                onConfirm={() => this.deleteSite(index)}
                okText="OK"
                cancelText="Cancel"
              >
                <Button style={{marginBottom: "10px"}} type="danger">{i18next.t("general:Delete")}</Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={sites} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
          title={() => (
            <div>
              {i18next.t("general:Sites")}&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" size="small" onClick={this.addSite.bind(this)}>{i18next.t("general:Add")}</Button>
            </div>
          )}
          loading={sites === null}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.renderTable(this.state.sites)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SiteListPage;
