import { CreationAttributes } from "@sequelize/core"
import { isNil, random } from "lodash"

import { User } from "@/models"
import BaseService from "@/services/base-service"

export type UserCreationAttributes = Partial<CreationAttributes<User>>

export class CreateService extends BaseService {
  constructor(private attributes: UserCreationAttributes) {
    super()
  }

  async perform(): Promise<User> {
    const { email, auth0Subject, roles, ...optionalAttributes } = this.attributes

    if (isNil(email)) {
      throw new Error("Email is required")
    }

    const auth0SubjectOrFallback = auth0Subject || email

    if (isNil(roles)) {
      throw new Error("Roles are required")
    }

    const [emailLocalPart] = email.split("@")
    /**
     * Yep, if we don't have enough data, your name becomes your email split randomly.
     * This way we can at least have a first name and last name,
     * and the first and last name are likely to be distinct.
     */
    const randomSplit = random(1, emailLocalPart.length - 2)
    const [firstNameFallback, lastNameFallback] = emailLocalPart.includes(".")
      ? emailLocalPart.split(".")
      : [emailLocalPart.slice(0, randomSplit), emailLocalPart.slice(randomSplit)]
    const { firstName, lastName } = optionalAttributes
    const firstNameOrFallback = firstName || firstNameFallback
    const lastNameOrFallback = lastName || lastNameFallback

    const workflowCategory = await User.create({
      ...optionalAttributes,
      email,
      auth0Subject: auth0SubjectOrFallback,
      firstName: firstNameOrFallback,
      lastName: lastNameOrFallback,
      displayName: `${firstNameOrFallback} ${lastNameOrFallback}`,
      roles,
    })

    return workflowCategory
  }
}

export default CreateService
