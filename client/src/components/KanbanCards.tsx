import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Form,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {
  createKanbanCard,
  deleteKanbanCard,
  getKanbanCards,
  patchKanbanCard,
  checkAttachmentURL
} from '../api/kanbancards-api'
import Auth from '../auth/Auth'
import { KanbanCard } from '../types/KanbanCard'
import Typist from 'react-typist'

interface KanbanCardsProps {
  auth: Auth
  history: History
}

interface KanbanCardsState {
  kanbancards: KanbanCard[]
  newKanbanCardName: string
  loadingKanbanCards: boolean
}

export class KanbanCards extends React.PureComponent<KanbanCardsProps, KanbanCardsState> {
  state: KanbanCardsState = {
    kanbancards: [],
    newKanbanCardName: '',
    loadingKanbanCards: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newKanbanCardName: event.target.value })
  }

  onEditButtonClick = (kanbanCardId: string) => {
    this.props.history.push(`/kanbancards/${kanbanCardId}/edit`)
  }

  onKanbanCardCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newKanbanCard = await createKanbanCard(this.props.auth.getIdToken(), {
        name: this.state.newKanbanCardName,
        dueDate
      })
      this.setState({
        kanbancards: [...this.state.kanbancards, newKanbanCard],
        newKanbanCardName: ''
      })
    } catch {
      alert('KanbanCard creation failed')
    }
  }

  onKanbanCardDelete = async (kanbanCardId: string) => {
    try {
      await deleteKanbanCard(this.props.auth.getIdToken(), kanbanCardId)
      this.setState({
        kanbancards: this.state.kanbancards.filter((kanbancard) => kanbancard.kanbanCardId != kanbanCardId)
      })
    } catch {
      alert('KanbanCard deletion failed')
    }
  }

  onKanbanCardCheck = async (pos: number) => {
    try {
      const kanbancard = this.state.kanbancards[pos]
      await patchKanbanCard(this.props.auth.getIdToken(), kanbancard.kanbanCardId, {
        name: kanbancard.name,
        dueDate: kanbancard.dueDate,
        done: !kanbancard.done
      })
      this.setState({
        kanbancards: update(this.state.kanbancards, {
          [pos]: { done: { $set: !kanbancard.done } }
        })
      })
    } catch {
      alert('KanbanCard update failed')
    }
  }

  onCheckAttachmentURL = async (
    kanbancard: KanbanCard,
    pos: number
  ): Promise<boolean> => {
    try {
      const response = kanbancard.attachmentUrl
        ? await checkAttachmentURL(kanbancard.attachmentUrl)
        : false

      this.setState({
        kanbancards: update(this.state.kanbancards, {
          [pos]: { validUrl: { $set: response } }
        })
      })

      return true
    } catch {
      return false
    }
  }

  async componentDidMount() {
    try {
      const kanbancards = await getKanbanCards(this.props.auth.getIdToken())

      this.setState({
        kanbancards,
        loadingKanbanCards: false
      })

      this.state.kanbancards.map(async (kanbancard, pos) => {
        kanbancard['validUrl'] = kanbancard.attachmentUrl
          ? await this.onCheckAttachmentURL(kanbancard, pos)
          : false

        return kanbancard
      })
    } catch (e) {
      alert(`Failed to fetch kanbancards: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Typist>
          <Header as="h1">Your Workload...</Header>
        </Typist>
        {this.renderCreateKanbanCardInput()}

        {this.renderKanbanCards()}
      </div>
    )
  }

  renderCreateKanbanCardInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'KanbanCard Entry',
              onClick: this.onKanbanCardCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Kanban Card..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderKanbanCards() {
    if (this.state.loadingKanbanCards) {
      return this.renderLoading()
    }

    return this.renderKanbanCardsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading your workload...
        </Loader>
      </Grid.Row>
    )
  }

  renderKanbanCardsList() {
    return (
      <Grid padded>
        {this.state.kanbancards.map((kanbancard, pos) => {
          return (
            <Grid.Row key={kanbancard.kanbanCardId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onKanbanCardCheck(pos)}
                  checked={kanbancard.done}
                />
              </Grid.Column>

              <Grid.Column width={10} verticalAlign="middle">
                {kanbancard.name}
              </Grid.Column>

              <Grid.Column width={3} floated="right">
                {kanbancard.dueDate}
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(kanbancard.kanbanCardId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onKanbanCardDelete(kanbancard.kanbanCardId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              {kanbancard.attachmentUrl && kanbancard.validUrl ? (
                <Image
                  src={kanbancard.attachmentUrl}
                  size="small"
                  wrapped
                  centered
                />
              ) : null}

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date, 'yyyy-mm-dd hh:mm:ss') as string
  }
}
