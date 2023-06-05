import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import { Button, SecondaryButton } from "../inputs/Button"
import { nftAbi } from "../../api/NftAbi/nftAbi"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
// import { Web3Storage } from "web3.storage"

const DialogContainer = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 4px;
  background-color: ${props => props.theme.black};
  max-width: 800px;
  min-width: 400px;
  min-height: 150px;
  max-height: 80vh;
`

const DialogHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 12px;
  overflow: hidden;
  height: 32px;
  font-weight: 400;
  background-color: ${props => props.theme.darkGray};
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;

  > * {
    display: flex;
    align-items: center;
  }
`

export const DialogContent = styled.div`
  color: ${props => props.theme.text};
  display: flex;
  flex: 1;
  flex-direction: row;
  /* This forces firefox to give the contents a proper height. */
  overflow: hidden;
  background: ${props => props.theme.dropdown};
  padding: 8px;
  min-height: 100px;

  h1 {
    font-size: 2em;
    color: ${props => props.theme.text};
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 12px;
    line-height: 1.5em;
  }
`

const DialogBottomNav = styled.div`
  display: flex;
  height: 64px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: ${props => props.theme.darkGray};
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  padding: 8px;

  .primary-save-btn {
    border: 1px solid #0092ff;
  }
  .save-btn {
    background: linear-gradient(92.34deg, #002bff -0.06%, #0092ff 99.94%);
    color: #fff;
    &:hover {
      border: none;
    }
  }

  a {
    color: ${props => props.theme.text2};
  }

  button {
    min-width: 84px;
  }

  & > * {
    margin: 0 8px;
  }
`

export default function Dialog({
  tag,
  title,
  onCancel,
  cancelLabel,
  onConfirm,
  confirmLabel,
  bottomNav,
  children,
  ...rest
}) {
  const { account, active, library } = useWeb3React()
  const [objectCID, setObjectCID] = useState("")
  console.log("account", account)

  const mintNftAddress = "0x2bcd90c44679e246b72De8f2be76b4332a46c85c".toLowerCase()

  const onSubmitForm = useCallback(
    async e => {
      // e.preventDefault()

      if (!onConfirm) return
      onConfirm(e)
      if (!account || !library.provider) return

      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhmMTBiYjIxQTFlNTE1MmVlZEJBNjEwMTk1NTdlNmIyMkVBMDhBMDEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM3OTc0MzU0MTcsIm5hbWUiOiJmdW5naWJsZXoifQ.XRneiYEVsMUm_Nsjp62CqIo18PBkwt61DzoooVhS0k8"

        const storage = new Web3Storage({ token: token })

        const obj = {
          name: "evalues.name",
          image: "https://hubs.local:9090/529a103e-a660-4e7b-8178-d6f0c3edeb8e"
        }

        console.log(obj)
        const blob = new Blob([JSON.stringify(obj)], {
          type: "application/json"
        })
        const Objectfiles = [new File([blob], "object.json")]
        const objectCid = await storage.put(Objectfiles)
        const objectres = await storage.get(objectCid)
        if (!objectres) return
        const files = await objectres.files()
        for (const file of files) {
          setObjectCID(file.cid)
        }

        const mintContract = new ethers.Contract(mintNftAddress, nftAbi, library.provider)
        const tx = await mintContract.mint(account, objectCID)
        await tx.wait()
      } catch (error) {
        console.log("Error sending File to IPFS:")
        console.log(error)
      }
    },
    [onConfirm, objectCID]
  )

  const onsubmit = async () => {
    if (!account || !library.provider) return

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhmMTBiYjIxQTFlNTE1MmVlZEJBNjEwMTk1NTdlNmIyMkVBMDhBMDEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM3OTc0MzU0MTcsIm5hbWUiOiJmdW5naWJsZXoifQ.XRneiYEVsMUm_Nsjp62CqIo18PBkwt61DzoooVhS0k8"

      // const storage = new Web3Storage({ token: token })

      const obj = {
        name: "evalues.name",
        image: "https://hubs.local:9090/529a103e-a660-4e7b-8178-d6f0c3edeb8e"
      }

      console.log(obj)
      const blob = new Blob([JSON.stringify(obj)], {
        type: "application/json"
      })
      const Objectfiles = [new File([blob], "object.json")]
      const objectCid = await storage.put(Objectfiles)
      const objectres = await storage.get(objectCid)
      if (!objectres) return
      const files = await objectres.files()
      for (const file of files) {
        setObjectCID(file.cid)
      }

      const mintContract = new ethers.Contract(mintNftAddress, nftAbi, library.provider)
      const tx = await mintContract.mint(account, objectCID)
      await tx.wait()
    } catch (error) {
      console.log("Error sending File to IPFS:")
      console.log(error)
    }
  }

  return (
    <>
      <DialogContainer as={tag} onSubmit={onSubmitForm} {...rest}>
        <DialogHeader>
          <span>{title}</span>
        </DialogHeader>
        <DialogContent>{children}</DialogContent>
        {(onConfirm || onCancel || bottomNav) && (
          <DialogBottomNav>
            {bottomNav}
            {onCancel && (
              <Button className="primary-save-btn" onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
            {onConfirm && (
              <Button className="save-btn" type="submit" onClick={tag === "form" ? null : onConfirm}>
                {confirmLabel}
              </Button>
            )}
            {/* <Button className="save-btn" type="submit" onClick={tag === "form" ? null : onConfirm}>
              save
            </Button> */}
          </DialogBottomNav>
        )}
      </DialogContainer>
      {/* <Button className="save-btn" type="submit" onClick={onsubmit}>
        save
      </Button> */}
    </>
  )
}

Dialog.propTypes = {
  tag: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  cancelLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  confirmLabel: PropTypes.string.isRequired,
  bottomNav: PropTypes.node,
  children: PropTypes.node
}

Dialog.defaultProps = {
  tag: "form",
  confirmLabel: "Ok",
  cancelLabel: "Cancel"
}
