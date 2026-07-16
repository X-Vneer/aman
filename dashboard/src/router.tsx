import { Route, Routes } from "react-router-dom"
import React, { Suspense } from "react"
const Login = React.lazy(async () => import("./app/auth/login/page"))
const AuthLayout = React.lazy(async () => import("./app/auth/layout"))
const ResetPassword = React.lazy(async () => import("./app/auth/reset-password/page"))
import { DashboardLayout } from "./app/dashboard/layout"
import { Loader } from "@mantine/core"
import { Navigate } from "./lib/i18n/navigation"
import Users from "./app/dashboard/users/page"
import Home from "./app/dashboard/page"
import Stories from "./app/dashboard/stories/page"
import Blogs from "./app/dashboard/blogs/page"
const AddBlog = React.lazy(async () => import("./app/dashboard/blogs/add/page"))
const EditBlog = React.lazy(async () => import("./app/dashboard/blogs/[id]/page"))
const AddPartner = React.lazy(async () => import("./app/dashboard/partners/add/page"))
const EditPartner = React.lazy(async () => import("./app/dashboard/partners/[id]/page"))
const ViewUser = React.lazy(async () => import("./app/dashboard/users/[id]/page"))
const Certificates = React.lazy(async () => import("./app/dashboard/certificates/page"))
const Reports = React.lazy(async () => import("./app/dashboard/reports/page"))
const Reviews = React.lazy(async () => import("./app/dashboard/reviews/page"))
const Contacts = React.lazy(async () => import("./app/dashboard/contacts/page"))
const ViewContact = React.lazy(async () => import("./app/dashboard/contacts/[id]/page"))
const Permissions = React.lazy(async () => import("./app/dashboard/permissions/page"))
const Programs = React.lazy(async () => import("./app/dashboard/programs/page"))
const EditProgram = React.lazy(async () => import("./app/dashboard/programs/[id]/page"))
const AddProgram = React.lazy(async () => import("./app/dashboard/programs/add/page"))
const AddScene = React.lazy(async () => import("./app/dashboard/programs/[id]/scenes/add/page"))
const EditScene = React.lazy(async () => import("./app/dashboard/programs/[id]/scenes/[sceneId]/page"))
const AddQuestion = React.lazy(async () => import("./app/dashboard/programs/[id]/questions/add/page"))
const EditQuestion = React.lazy(
  async () => import("./app/dashboard/programs/[id]/questions/[questionId]/page"),
)
const Awareness = React.lazy(() => import("./app/dashboard/awareness/page"))
const AddAwarenessPage = React.lazy(async () => import("./app/dashboard/awareness/add/page"))
const EditAwarenessPage = React.lazy(async () => import("./app/dashboard/awareness/[id]/page"))
const Partners = React.lazy(async () => import("./app/dashboard/partners/page"))

const Router = () => {
  return (
    <Routes>
      <Route path="/:locale?">
        <Route index element={<Navigate to={"/dashboard"} />} />
        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<Navigate to={"/auth/login"} />} />
          <Route
            path="login"
            element={
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center py-20">
                    <Loader size={"md"} />
                  </div>
                }>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="reset-password"
            element={
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center py-20">
                    <Loader size={"md"} />
                  </div>
                }>
                <ResetPassword />
              </Suspense>
            }
          />
        </Route>

        <Route path="dashboard" element={<DashboardLayout />}>
          <Route
            index
            element={
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center py-20">
                    <Loader size={"md"} />
                  </div>
                }>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center py-20">
                    <Loader size={"md"} />
                  </div>
                }>
                <Reports />
              </Suspense>
            }
          />
          {/* Programs */}
          <Route path="Programs">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Programs />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <AddProgram />
                </Suspense>
              }
            />

            <Route path=":id">
              <Route
                index
                element={
                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center py-20">
                        <Loader size={"md"} />
                      </div>
                    }>
                    <EditProgram />
                  </Suspense>
                }
              />

              <Route path="scenes">
                <Route
                  path="add"
                  element={
                    <Suspense
                      fallback={
                        <div className="flex h-full items-center justify-center py-20">
                          <Loader size={"md"} />
                        </div>
                      }>
                      <AddScene />
                    </Suspense>
                  }
                />
                <Route
                  path=":sceneId"
                  element={
                    <Suspense
                      fallback={
                        <div className="flex h-full items-center justify-center py-20">
                          <Loader size={"md"} />
                        </div>
                      }>
                      <EditScene />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="questions">
                <Route
                  path="add"
                  element={
                    <Suspense
                      fallback={
                        <div className="flex h-full items-center justify-center py-20">
                          <Loader size={"md"} />
                        </div>
                      }>
                      <AddQuestion />
                    </Suspense>
                  }
                />
                <Route
                  path=":questionId"
                  element={
                    <Suspense
                      fallback={
                        <div className="flex h-full items-center justify-center py-20">
                          <Loader size={"md"} />
                        </div>
                      }>
                      <EditQuestion />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
          </Route>
          {/* users */}
          <Route path="users">
            <Route index element={<Users />} />
            <Route
              path=":id"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <ViewUser />
                </Suspense>
              }
            />
          </Route>
          {/* reviews */}
          <Route path="reviews">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Reviews />
                </Suspense>
              }
            />
          </Route>
          {/* contacts */}
          <Route path="contacts">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Contacts />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <ViewContact />
                </Suspense>
              }
            />
          </Route>
          {/* permissions */}
          <Route path="permissions">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Permissions />
                </Suspense>
              }
            />
          </Route>
          {/* certificates */}
          <Route path="certificates">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Certificates />
                </Suspense>
              }
            />
          </Route>
          {/* Awareness */}
          <Route path="awareness">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Awareness />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <AddAwarenessPage />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <EditAwarenessPage />
                </Suspense>
              }
            />
          </Route>
          {/* stories */}
          <Route path="stories">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Stories />
                </Suspense>
              }
            />
          </Route>
          {/* blogs */}
          <Route path="blogs">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <Blogs />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <AddBlog />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <EditBlog />
                </Suspense>
              }
            />
          </Route>
          {/* partners */}
          <Route path="partners">
            <Route
              index
              element={
                <Suspense>
                  <Partners />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center py-20">
                      <Loader size={"md"} />
                    </div>
                  }>
                  <AddPartner />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense>
                  <EditPartner />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default Router
